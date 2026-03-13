# Backend Service Stop Script

$ErrorActionPreference = "Stop"

# Get script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PID_FILE = Join-Path $SCRIPT_DIR "app.pid"
$LOG_DIR = Join-Path $SCRIPT_DIR "logs"

# Check if PID file exists
if (-not (Test-Path $PID_FILE)) {
    Write-Host "No running backend service (PID file not found)"
    exit 0
}

# Read PID
$pid = Get-Content $PID_FILE -ErrorAction SilentlyContinue
if (-not $pid) {
    Write-Host "PID file is empty"
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
    exit 0
}

# Check if process exists
$process = Get-Process -Id $pid -ErrorAction SilentlyContinue
if (-not $process) {
    Write-Host "Process not found (PID: $pid)"
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
    exit 0
}

# Stop process
Write-Host "Stopping backend service (PID: $pid)..."
Stop-Process -Id $pid -Force

# Wait for process to end
$maxWait = 10
for ($i = 1; $i -le $maxWait; $i++) {
    $stillRunning = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if (-not $stillRunning) {
        break
    }
    Start-Sleep -Seconds 1
    Write-Host "Waiting... ($i/$maxWait)"
}

# Force kill if still running
$stillRunning = Get-Process -Id $pid -ErrorAction SilentlyContinue
if ($stillRunning) {
    Write-Host "Force killing process..."
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

# Clean up PID file
Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue

Write-Host "Backend service stopped"
