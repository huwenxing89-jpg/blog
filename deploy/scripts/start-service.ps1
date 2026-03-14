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

$LOG_DIR = Join-Path $SCRIPT_DIR "logs"
$LOG_FILE = Join-Path $LOG_DIR "backend.log"
$ERROR_LOG = Join-Path $LOG_DIR "error.log"
$PID_FILE = Join-Path $SCRIPT_DIR "app.pid"
$JAR_PATTERN = "app-*.jar"

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

# Also kill any java processes running app-*.jar in this directory
Write-Host "Checking for orphaned Java processes..."
$javaProcesses = Get-Process -Name java -ErrorAction SilentlyContinue
foreach ($javaProc in $javaProcesses) {
    try {
        $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId = $($javaProc.Id)").CommandLine
        if ($cmdLine -and $cmdLine -like "*$SCRIPT_DIR*app*jar*") {
            Write-Host "Killing orphaned Java process (PID: $($javaProc.Id))"
            Stop-Process -Id $javaProc.Id -Force -ErrorAction SilentlyContinue
        }
    } catch {}
}

# Find the JAR file to use
# Priority: app.jar (new deployment) > latest app-*.jar (timestamped)
$JAR_FILE = $null

if (Test-Path (Join-Path $SCRIPT_DIR "app.jar")) {
    $JAR_FILE = Join-Path $SCRIPT_DIR "app.jar"
    Write-Host "Found app.jar (new deployment)"
} else {
    # Find latest app-*.jar
    $jarFiles = Get-ChildItem -Path $SCRIPT_DIR -Filter "app-*.jar" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    if ($jarFiles) {
        $JAR_FILE = $jarFiles[0].FullName
        Write-Host "Found latest JAR: $($jarFiles[0].Name)"
    }
}

# Check if JAR file exists
if (-not $JAR_FILE -or -not (Test-Path $JAR_FILE)) {
    Write-Host "Error: No JAR file found in $SCRIPT_DIR"
    Write-Host "Looking for app.jar or app-*.jar"
    exit 1
}

# Start new service
Write-Host "Starting backend service..."
Write-Host "JAR file: $JAR_FILE"
Write-Host "Log file: $LOG_FILE"

# Kill SFTP processes that might lock the JAR file
Write-Host "Stopping SFTP processes to release file locks..."
Stop-Process -Name sftp-server -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# If using app.jar, rename it to a timestamped name to avoid future lock issues
if ($JAR_FILE -like "*app.jar") {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $newJarName = "app-$timestamp.jar"
    $newJarPath = Join-Path $SCRIPT_DIR $newJarName

    Write-Host "Renaming app.jar to $newJarName to avoid file lock issues..."
    try {
        Move-Item -Path $JAR_FILE -Destination $newJarPath -Force -ErrorAction Stop
        $JAR_FILE = $newJarPath
        Write-Host "Rename successful"

        # Clean up old JAR files (keep only latest 3)
        $oldJars = Get-ChildItem -Path $SCRIPT_DIR -Filter "app-*.jar" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 3
        foreach ($oldJar in $oldJars) {
            Write-Host "Removing old JAR: $($oldJar.Name)"
            Remove-Item $oldJar.FullName -Force -ErrorAction SilentlyContinue
        }
    } catch {
        Write-Host "Warning: Could not rename JAR file: $_"
        Write-Host "Will try to use it directly..."
    }
}

# Use Start-Process with absolute path to JAR file
$processArgs = @{
    FilePath = "java"
    ArgumentList = "-jar", $JAR_FILE, "--spring.profiles.active=prod", "--server.port=8088"
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
