# Frontend Service Start/Stop Script
# Usage: start-frontend.ps1 -Action Start|Stop

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Start", "Stop")]
    [string]$Action
)

$ErrorActionPreference = "Stop"

# Get script directory - handle both direct execution and SSH invocation
if ($MyInvocation.MyCommand.Path) {
    $SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
} elseif ($PSScriptRoot) {
    $SCRIPT_DIR = $PSScriptRoot
} else {
    # Fallback to current directory
    $SCRIPT_DIR = Get-Location
}

Write-Host "Script directory: $SCRIPT_DIR"

$PID_FILE = Join-Path $SCRIPT_DIR "frontend.pid"
$LOG_FILE = Join-Path $SCRIPT_DIR "logs\frontend.log"
$LOG_DIR = Join-Path $SCRIPT_DIR "logs"

function Stop-Service {
    # First, kill any process using port 3000
    Write-Host "Checking for processes using port 3000..."
    $port3000Processes = netstat -ano | findstr ":3000" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

    if ($port3000Processes) {
        foreach ($procId in $port3000Processes) {
            if ($procId -and $procId -ne "0") {
                Write-Host "Killing process $procId using port 3000..."
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
        Start-Sleep -Seconds 3
    }

    # Also kill all node processes to be safe
    Write-Host "Stopping all node processes..."
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    # Check if PID file exists
    if (-not (Test-Path $PID_FILE)) {
        Write-Host "No running frontend service (PID file not found)"
        return
    }

    # Read PID
    $savedPid = Get-Content $PID_FILE -ErrorAction SilentlyContinue
    if (-not $savedPid) {
        Write-Host "PID file is empty"
        Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
        return
    }

    # Check if process exists
    $process = Get-Process -Id $savedPid -ErrorAction SilentlyContinue
    if (-not $process) {
        Write-Host "Process not found (PID: $savedPid)"
        Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
        return
    }

    # Stop process
    Write-Host "Stopping frontend service (PID: $savedPid)..."
    Stop-Process -Id $savedPid -Force

    # Wait for process to end
    $maxWait = 10
    for ($i = 1; $i -le $maxWait; $i++) {
        $stillRunning = Get-Process -Id $savedPid -ErrorAction SilentlyContinue
        if (-not $stillRunning) {
            break
        }
        Start-Sleep -Seconds 1
    }

    # Force kill if still running
    $stillRunning = Get-Process -Id $savedPid -ErrorAction SilentlyContinue
    if ($stillRunning) {
        Stop-Process -Id $savedPid -Force -ErrorAction SilentlyContinue
    }

    # Clean up PID file
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
    Write-Host "Frontend service stopped"
}

function Start-Service {
    # Ensure log directory exists
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }

    # ALWAYS stop any existing processes on port 3000 first
    Write-Host "Ensuring port 3000 is free..."

    # Kill any process using port 3000
    $port3000Processes = netstat -ano | findstr ":3000" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

    if ($port3000Processes) {
        foreach ($procId in $port3000Processes) {
            if ($procId -and $procId -ne "0") {
                Write-Host "Killing process $procId using port 3000..."
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
        Start-Sleep -Seconds 3
    }

    # Also kill all node processes to be safe
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    # Verify port is free
    $portCheck = netstat -ano | findstr ":3000"
    if ($portCheck) {
        Write-Host "Warning: Port 3000 still in use, forcing cleanup..."
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 3
    }

    Write-Host "Port 3000 is now free"

    # Diagnostic info
    Write-Host "Working directory: $SCRIPT_DIR"
    Write-Host "Checking for server.js..."
    $serverJsPath = Join-Path $SCRIPT_DIR "server.js"
    if (-not (Test-Path $serverJsPath)) {
        Write-Host "Error: server.js not found at $serverJsPath"
        Write-Host "Directory contents:"
        Get-ChildItem $SCRIPT_DIR | ForEach-Object { Write-Host "  $_" }
        exit 1
    }
    Write-Host "server.js found"

    # Check Node.js
    Write-Host "Checking Node.js..."
    try {
        $nodeVersion = & node --version 2>&1
        Write-Host "Node.js version: $nodeVersion"
    } catch {
        Write-Host "Error: Node.js not found in PATH"
        exit 1
    }

    # Set environment variables
    $env:PORT = "3000"
    $env:NODE_ENV = "production"

    # Start new service
    Write-Host "Starting frontend service..."

    $errorLogFile = Join-Path $LOG_DIR "frontend-error.log"

    # Create a wrapper script that keeps running and auto-restarts on failure
    $wrapperScript = @"
@echo off
cd /d "$SCRIPT_DIR"
:restart
echo [%date% %time%] Starting frontend service... >> "$LOG_FILE"
node server.js >> "$LOG_FILE" 2>> "$errorLogFile"
if %errorlevel% neq 0 (
    echo [%date% %time%] Frontend crashed with exit code %errorlevel%, restarting in 5 seconds... >> "$errorLogFile"
    timeout /t 5 /nobreak > nul
    goto restart
)
"@
    $wrapperPath = Join-Path $SCRIPT_DIR "run-frontend.bat"
    $wrapperScript | Out-File -FilePath $wrapperPath -Encoding ASCII -Force

    # Start the batch file in background using start command to detach from current session
    $processArgs = @{
        FilePath = "cmd.exe"
        ArgumentList = "/c", "start", """FrontendService""", "/min", $wrapperPath
        PassThru = $true
    }

    $process = Start-Process @processArgs

    # Wait for the service to start
    Write-Host "Waiting for frontend service to start..."
    $maxWait = 30
    $started = $false

    for ($i = 1; $i -le $maxWait; $i++) {
        Start-Sleep -Seconds 1

        # Check if port 3000 is listening (using findstr for reliability)
        $portCheck = netstat -ano | findstr ":3000.*LISTENING"
        if ($portCheck) {
            $started = $true
            break
        }

        Write-Host "Waiting... ($i/$maxWait)"
    }

    if (-not $started) {
        Write-Host "Error: Frontend service failed to start within $maxWait seconds"
        if (Test-Path $errorLogFile) {
            Write-Host "Error log content:"
            Get-Content $errorLogFile -Tail 20
        }
        if (Test-Path $LOG_FILE) {
            Write-Host "Service log content:"
            Get-Content $LOG_FILE -Tail 20
        }
        exit 1
    }

    # Find the node process for PID file
    $nodeProcess = Get-Process -Name node -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($nodeProcess) {
        $nodeProcess.Id | Out-File -FilePath $PID_FILE -Force
        Write-Host "Frontend service started (PID: $($nodeProcess.Id))"
    } else {
        Write-Host "Frontend service started (port 3000 is listening)"
    }

    Write-Host "Log file: $LOG_FILE"
}

# Main logic
switch ($Action) {
    "Stop" { Stop-Service }
    "Start" { Start-Service }
}
