# Backend Service Start Script

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

$JAR_FILE = Join-Path $SCRIPT_DIR "app.jar"
$LOG_DIR = Join-Path $SCRIPT_DIR "logs"
$LOG_FILE = Join-Path $LOG_DIR "backend.log"
$ERROR_LOG = Join-Path $LOG_DIR "error.log"
$PID_FILE = Join-Path $SCRIPT_DIR "app.pid"

# Ensure log directory exists
if (-not (Test-Path $LOG_DIR)) {
    New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
}

# Stop existing service
if (Test-Path $PID_FILE) {
    $oldPid = Get-Content $PID_FILE -ErrorAction SilentlyContinue
    if ($oldPid) {
        $process = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Stopping existing service (PID: $oldPid)"
            Stop-Process -Id $oldPid -Force
            Start-Sleep -Seconds 3
        }
    }
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
}

# Check if JAR file exists
if (-not (Test-Path $JAR_FILE)) {
    Write-Host "Error: JAR file not found - $JAR_FILE"
    exit 1
}

# Start new service
Write-Host "Starting backend service..."
Write-Host "JAR file: $JAR_FILE"
Write-Host "Log file: $LOG_FILE"

# Use Start-Process with -WorkingDirectory to ensure proper path resolution
$processArgs = @{
    FilePath = "java"
    ArgumentList = "-jar", "app.jar", "--spring.profiles.active=prod", "--server.port=8088"
    WorkingDirectory = $SCRIPT_DIR
    WindowStyle = "Hidden"
    RedirectStandardOutput = $LOG_FILE
    RedirectStandardError = $ERROR_LOG
    PassThru = $true
}

$process = Start-Process @processArgs

# Wait a moment to ensure process starts
Start-Sleep -Seconds 5

# Check if process is still running
$runningProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
if (-not $runningProcess) {
    Write-Host "Error: Backend service failed to start, check logs"
    if (Test-Path $ERROR_LOG) {
        Get-Content $ERROR_LOG -Tail 50
    }
    exit 1
}

# Save PID
$process.Id | Out-File -FilePath $PID_FILE -Force

Write-Host "Backend service started (PID: $($process.Id))"
Write-Host "Log file: $LOG_FILE"
Write-Host "Error log: $ERROR_LOG"
