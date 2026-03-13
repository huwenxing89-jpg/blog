# 后端服务启动脚本
# 文件位置: C:\inetpub\wwwroot\blog-backend\start-service.ps1

$ErrorActionPreference = "Stop"

$JAR_FILE = "C:\inetpub\wwwroot\blog-backend\app.jar"
$LOG_DIR = "C:\inetpub\wwwroot\blog-backend\logs"
$LOG_FILE = "$LOG_DIR\backend.log"
$ERROR_LOG = "$LOG_DIR\error.log"
$PID_FILE = "C:\inetpub\wwwroot\blog-backend\app.pid"

# 确保日志目录存在
if (-not (Test-Path $LOG_DIR)) {
    New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
}

# 停止现有服务
if (Test-Path $PID_FILE) {
    $oldPid = Get-Content $PID_FILE -ErrorAction SilentlyContinue
    if ($oldPid) {
        $process = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "停止现有服务 (PID: $oldPid)"
            Stop-Process -Id $oldPid -Force
            Start-Sleep -Seconds 3
        }
    }
    Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
}

# 检查 JAR 文件是否存在
if (-not (Test-Path $JAR_FILE)) {
    Write-Host "错误: JAR 文件不存在 - $JAR_FILE"
    exit 1
}

# 启动新服务
Write-Host "启动后端服务..."
Write-Host "JAR 文件: $JAR_FILE"
Write-Host "日志文件: $LOG_FILE"

$arguments = @(
    "-jar"
    $JAR_FILE
    "--spring.profiles.active=prod"
    "--server.port=8088"
)

# 启动进程
$process = Start-Process -FilePath "java" -ArgumentList $arguments -NoNewWindow -PassThru -RedirectStandardOutput $LOG_FILE -RedirectStandardError $ERROR_LOG

# 等待一下确保进程启动
Start-Sleep -Seconds 2

# 检查进程是否还在运行
$runningProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
if (-not $runningProcess) {
    Write-Host "错误: 后端服务启动失败，请检查日志"
    Get-Content $ERROR_LOG -Tail 50
    exit 1
}

# 保存 PID
$process.Id | Out-File -FilePath $PID_FILE -Force

Write-Host "后端服务已启动 (PID: $($process.Id))"
Write-Host "日志文件: $LOG_FILE"
Write-Host "错误日志: $ERROR_LOG"
