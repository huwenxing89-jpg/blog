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
    $port3000Processes = netstat -ano | Select-String ":3000\s" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

    if ($port3000Processes) {
        foreach ($procId in $port3000Processes) {
            if ($procId -and $procId -ne "0") {
                Write-Host "Killing process $procId using port 3000..."
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            }
        }
        Start-Sleep -Seconds 2
    }

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

    # Stop existing service first
    if (Test-Path $PID_FILE) {
        Stop-Service
        Start-Sleep -Seconds 2
    }

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
    $process = Start-Process -FilePath "node" -ArgumentList "server.js" -WindowStyle Hidden -PassThru -WorkingDirectory $SCRIPT_DIR -RedirectStandardOutput $LOG_FILE -RedirectStandardError $errorLogFile

    # Wait a moment to ensure process starts
    Start-Sleep -Seconds 3

    # Check if process is still running
    $runningProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
    if (-not $runningProcess) {
        Write-Host "Error: Frontend service failed to start"
        # Show error log if exists
        if (Test-Path $errorLogFile) {
            Write-Host "Error log content:"
            Get-Content $errorLogFile -Tail 20
        }
        exit 1
    }

    # Save PID
    $process.Id | Out-File -FilePath $PID_FILE -Force

    Write-Host "Frontend service started (PID: $($process.Id))"
    Write-Host "Log file: $LOG_FILE"
}

# Main logic
switch ($Action) {
    "Stop" { Stop-Service }
    "Start" { Start-Service }
}
