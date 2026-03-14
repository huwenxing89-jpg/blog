# Backend Service Stop Script

$ErrorActionPreference = "Stop"

# Get script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PID_FILE = Join-Path $SCRIPT_DIR "app.pid"
$LOG_DIR = Join-Path $SCRIPT_DIR "logs"
$PORT = 8088

# First, kill any process using port 8088
Write-Host "Checking for processes using port $PORT..."
$portProcesses = netstat -ano | Select-String ":$PORT\s" | ForEach-Object {
    ($_ -split '\s+')[-1]
} | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

if ($portProcesses) {
    foreach ($procId in $portProcesses) {
        if ($procId -and $procId -ne "0") {
            Write-Host "Killing process $procId using port $PORT..."
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 2
    Write-Host "Backend service stopped"
} else {
    Write-Host "No process found using port $PORT"
}

# Check if PID file exists and clean up
if (Test-Path $PID_FILE) {
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
    Write-Host "PID file cleaned up"
}
