# Install Frontend as Windows Service using NSSM
# Usage: Run this script once as Administrator to install the service

param(
    [string]$ServiceName = "BlogFrontend",
    [string]$DeployPath = "",
    [string]$NodePath = ""
)

$ErrorActionPreference = "Stop"

# Auto-detect paths if not provided
if (-not $DeployPath) {
    $DeployPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    if (-not $DeployPath) {
        $DeployPath = $PSScriptRoot
    }
}

if (-not $NodePath) {
    $NodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $NodePath) {
        $NodePath = "C:\Program Files\nodejs\node.exe"
    }
}

Write-Host "=== Installing Blog Frontend Service ===" -ForegroundColor Green
Write-Host "Service Name: $ServiceName"
Write-Host "Deploy Path: $DeployPath"
Write-Host "Node Path: $NodePath"
Write-Host ""

# Check if server.js exists
$serverJs = Join-Path $DeployPath "server.js"
if (-not (Test-Path $serverJs)) {
    Write-Host "Error: server.js not found at $serverJs" -ForegroundColor Red
    exit 1
}

# Check if Node.js exists
if (-not (Test-Path $NodePath)) {
    Write-Host "Error: Node.js not found at $NodePath" -ForegroundColor Red
    exit 1
}

# Check if NSSM is available
$nssm = Get-Command nssm -ErrorAction SilentlyContinue
if (-not $nssm) {
    # Try common locations
    $nssmPaths = @(
        "C:\nssm\nssm.exe",
        "C:\Program Files\nssm\nssm.exe",
        "${env:ProgramFiles}\nssm\nssm.exe",
        "${env:ProgramFiles(x86)}\nssm\nssm.exe"
    )
    foreach ($path in $nssmPaths) {
        if (Test-Path $path) {
            $nssm = $path
            break
        }
    }
}

if (-not $nssm) {
    Write-Host "NSSM not found. Downloading..." -ForegroundColor Yellow

    $nssmDir = "C:\nssm"
    $nssmZip = Join-Path $env:TEMP "nssm.zip"

    # Download NSSM
    $nssmUrl = "https://nssm.cc/ci/nssm-2.24.zip"
    try {
        Invoke-WebRequest -Uri $nssmUrl -OutFile $nssmZip -UseBasicParsing
        Expand-Archive -Path $nssmZip -DestinationPath $env:TEMP -Force

        # Find nssm.exe in extracted folder
        $extractedNssm = Get-ChildItem -Path $env:TEMP -Filter "nssm.exe" -Recurse | Select-Object -First 1
        if ($extractedNssm) {
            New-Item -ItemType Directory -Path $nssmDir -Force | Out-Null
            Copy-Item $extractedNssm.FullName $nssmDir -Force
            $nssm = Join-Path $nssmDir "nssm.exe"
            Write-Host "NSSM installed to $nssm" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error downloading NSSM: $_" -ForegroundColor Red
        Write-Host "Please download manually from https://nssm.cc/download" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "NSSM found at: $nssm" -ForegroundColor Green

# Check if service already exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Host "Service '$ServiceName' already exists. Stopping and removing..." -ForegroundColor Yellow
    & $nssm stop $ServiceName 2>&1 | Out-Null
    Start-Sleep -Seconds 2
    & $nssm remove $ServiceName confirm 2>&1 | Out-Null
    Start-Sleep -Seconds 2
}

# Create log directory
$logDir = Join-Path $DeployPath "logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Install service
Write-Host "Installing service..." -ForegroundColor Yellow

# Create a simple startup script
$startScript = @"
@echo off
cd /d "$DeployPath"
set PORT=3000
set NODE_ENV=production
node server.js
"@
$startScriptPath = Join-Path $DeployPath "start-frontend.bat"
$startScript | Out-File -FilePath $startScriptPath -Encoding ASCII -Force

# Install using NSSM
& $nssm install $ServiceName $NodePath
& $nssm set $ServiceName AppDirectory $DeployPath
& $nssm set $ServiceName Application server.js
& $nssm set $ServiceName AppEnvironmentExtra PORT=3000 NODE_ENV=production
& $nssm set $ServiceName DisplayName "Blog Frontend Service"
& $nssm set $ServiceName Description "Next.js frontend service for Blog application"
& $nssm set $ServiceName Start SERVICE_AUTO_START
& $nssm set $ServiceName AppStdout (Join-Path $logDir "frontend.log")
& $nssm set $ServiceName AppStderr (Join-Path $logDir "frontend-error.log")
& $nssm set $ServiceName AppRotateFiles 1
& $nssm set $ServiceName AppRotateBytes 1048576
& $nssm set $ServiceName AppRotateBackups 5

# Set restart policy
& $nssm set $ServiceName AppExit Default Restart
& $nssm set $ServiceName AppRestartDelay 5000

Write-Host "Service installed successfully!" -ForegroundColor Green
Write-Host ""

# Ask if should start now
$startNow = Read-Host "Start service now? (Y/n)"
if ($startNow -ne "n" -and $startNow -ne "N") {
    Write-Host "Starting service..." -ForegroundColor Yellow
    & $nssm start $ServiceName
    Start-Sleep -Seconds 5

    # Check if running
    $service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq "Running") {
        Write-Host "Service started successfully!" -ForegroundColor Green
    } else {
        Write-Host "Service may not have started properly. Check logs at:" -ForegroundColor Yellow
        Write-Host "  $logDir\frontend.log"
        Write-Host "  $logDir\frontend-error.log"
    }
}

Write-Host ""
Write-Host "=== Service Management Commands ===" -ForegroundColor Green
Write-Host "Start:   net start $ServiceName"
Write-Host "Stop:    net stop $ServiceName"
Write-Host "Status:  sc query $ServiceName"
Write-Host "Remove:  nssm remove $ServiceName confirm"
