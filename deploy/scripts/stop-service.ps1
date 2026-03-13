# 后端服务停止脚本
# 文件位置: C:\inetpub\wwwroot\blog-backend\stop-service.ps1

$ErrorActionPreference = "Stop"

$PID_FILE = "C:\inetpub\wwwroot\blog-backend\app.pid"
$LOG_DIR = "C:\inetpub\wwwroot\blog-backend\logs"

# 检查 PID 文件是否存在
if (-not (Test-Path $PID_FILE)) {
    Write-Host "没有运行的后端服务 (PID 文件不存在)"
    exit 0
}

# 读取 PID
$pid = Get-Content $PID_FILE -ErrorAction SilentlyContinue
if (-not $pid) {
    Write-Host "PID 文件为空"
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
    exit 0
}

# 检查进程是否存在
$process = Get-Process -Id $pid -ErrorAction SilentlyContinue
if (-not $process) {
    Write-Host "进程已不存在 (PID: $pid)"
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
    exit 0
}

# 停止进程
Write-Host "停止后端服务 (PID: $pid)..."
Stop-Process -Id $pid -Force

# 等待进程结束
$maxWait = 10
for ($i = 1; $i -le $maxWait; $i++) {
    $stillRunning = Get-Process -Id $pid -ErrorAction SilentlyContinue
    if (-not $stillRunning) {
        break
    }
    Start-Sleep -Seconds 1
    Write-Host "等待进程结束... ($i/$maxWait)"
}

# 强制结束（如果还在运行）
$stillRunning = Get-Process -Id $pid -ErrorAction SilentlyContinue
if ($stillRunning) {
    Write-Host "强制结束进程..."
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
}

# 清理 PID 文件
Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue

Write-Host "后端服务已停止"
