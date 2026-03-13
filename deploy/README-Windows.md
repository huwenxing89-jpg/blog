# Blog Windows 服务器部署指南

本文档说明如何将 Blog 项目自动部署到 Windows 云服务器。

## 架构概览

```
GitHub Actions --> Windows 云服务器
     │
     ├── 前端: Next.js (端口 3000) --> Nginx (端口 80)
     ├── 后端: Spring Boot (端口 8088) --> Nginx 代理
     └── 数据库: MySQL (端口 3306)
```

**端口说明：**
- 外部访问: 80 (HTTP) / 443 (HTTPS) - 通过 Nginx 统一入口
- 前端服务: 3000 (内部)
- 后端服务: 8088 (内部)

## 部署路径

| 组件 | 服务器路径 |
|------|-----------|
| 前端文件 | `C:\inetpub\wwwroot\blog-frontend` |
| 后端 JAR | `C:\inetpub\wwwroot\blog-backend\app.jar` |
| 后端日志 | `C:\inetpub\wwwroot\blog-backend\logs\` |
| Nginx 配置 | `C:\nginx\conf\conf.d\blog.conf` |

## 前置要求

### Windows 服务器要求
- 操作系统: Windows Server 2016+
- 内存: 至少 4GB
- 存储: 至少 20GB

### 需要安装的软件
- **JDK 8** - [下载地址](https://adoptium.net/temurin/releases/?version=8)
- **Node.js 20+** - [下载地址](https://nodejs.org/)
- **MySQL 8.0** - [下载地址](https://dev.mysql.com/downloads/mysql/)
- **Git** - [下载地址](https://git-scm.com/download/win)
- **Nginx for Windows** - [下载地址](https://nginx.org/en/download.html)

### 环境变量配置

确保以下环境变量已配置：
```
JAVA_HOME=C:\Program Files\Java\jdk1.8.0_xxx
Path 包含: %JAVA_HOME%\bin, node.js 目录, npm 目录
```

## 快速开始

### 步骤 1: 启用 SSH 服务

Windows 服务器需要启用 OpenSSH Server：

```powershell
# 以管理员身份运行 PowerShell

# 安装 OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# 启动并设置开机自启
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'

# 允许密码登录
$configPath = "$env:ProgramData\ssh\sshd_config"
(Get-Content $configPath) -replace '#PasswordAuthentication yes', 'PasswordAuthentication yes' | Set-Content $configPath
Restart-Service sshd
```

### 步骤 2: 安装并配置 Nginx

```powershell
# 下载 Nginx
Invoke-WebRequest -Uri "https://nginx.org/download/nginx-1.24.0.zip" -OutFile "C:\nginx.zip"

# 解压
Expand-Archive -Path "C:\nginx.zip" -DestinationPath "C:\" -Force
Rename-Item -Path "C:\nginx-1.24.0" -NewName "nginx" -ErrorAction SilentlyContinue

# 创建配置目录
New-Item -ItemType Directory -Path "C:\nginx\conf\conf.d" -Force

# 复制配置文件 (部署后执行)
Copy-Item "C:\inetpub\wwwroot\blog-backend\deploy\nginx\blog-windows.conf" "C:\nginx\conf\conf.d\blog.conf"

# 修改 nginx.conf，在 http 块末尾添加
Add-Content -Path "C:\nginx\conf\nginx.conf" -Value "include conf.d/*.conf;"
```

### 步骤 3: 初始化数据库

```powershell
# 使用 PowerShell 执行 SQL
mysql -u root -p --default-character-set=utf8mb4 < C:\inetpub\wwwroot\blog-backend\deploy\init-db.sql
```

### 步骤 4: 配置 GitHub Secrets

在 GitHub 仓库中添加以下 Secrets：

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `DEPLOY_SERVER` | 服务器 IP | `123.45.67.89` |
| `DEPLOY_USER` | SSH 用户名 | `Administrator` |
| `DEPLOY_PASSWORD` | SSH 密码 | `your_password` |
| `DEPLOY_PATH_BACKEND` | 后端路径 | `C:\inetpub\wwwroot\blog-backend` |
| `DEPLOY_PATH_FRONTEND` | 前端路径 | `C:\inetpub\wwwroot\blog-frontend` |
| `NEXT_PUBLIC_API_URL` | API 地址 | `http://your-domain/api` |

### 步骤 5: 触发部署

推送代码到 `main` 分支，或手动触发 GitHub Actions。

## 服务管理

### 后端服务

```powershell
# 启动后端
cd C:\inetpub\wwwroot\blog-backend
powershell -ExecutionPolicy Bypass -File start-service.ps1

# 停止后端
powershell -ExecutionPolicy Bypass -File stop-service.ps1

# 查看日志
Get-Content C:\inetpub\wwwroot\blog-backend\logs\backend.log -Tail 50
Get-Content C:\inetpub\wwwroot\blog-backend\logs\backend.log -Tail 50 -Wait  # 实时查看
```

### 前端服务

```powershell
# 启动前端
cd C:\inetpub\wwwroot\blog-frontend
Start-Process npm -ArgumentList "start" -NoNewWindow

# 查看前端进程
Get-Process -Name node

# 停止前端
Stop-Process -Name node -Force
```

### Nginx 服务

```powershell
# 启动 Nginx
cd C:\nginx
start nginx

# 停止 Nginx
nginx -s stop

# 重载配置
nginx -s reload

# 测试配置
nginx -t
```

## 文件结构

```
C:\inetpub\wwwroot\
├── blog-frontend\           # 前端目录
│   ├── .next\              # 构建输出
│   ├── public\             # 静态文件
│   ├── node_modules\       # 依赖
│   └── package.json
│
└── blog-backend\           # 后端目录
    ├── app.jar            # 可执行 JAR
    ├── app.pid            # 进程 ID 文件
    ├── logs\              # 日志目录
    │   ├── backend.log
    │   └── error.log
    ├── start-service.ps1  # 启动脚本
    └── stop-service.ps1   # 停止脚本

C:\nginx\
├── conf\
│   ├── nginx.conf         # 主配置
│   └── conf.d\
│       └── blog.conf      # Blog 站点配置
└── logs\                  # Nginx 日志
```

## 故障排查

### 后端无法启动

```powershell
# 检查 Java 是否安装
java -version

# 检查端口是否被占用
netstat -ano | findstr :8088

# 查看错误日志
Get-Content C:\inetpub\wwwroot\blog-backend\logs\error.log
```

### 前端无法访问

```powershell
# 检查 Node.js 是否安装
node -v
npm -v

# 检查端口是否被占用
netstat -ano | findstr :3000

# 手动启动测试
cd C:\inetpub\wwwroot\blog-frontend
npm start
```

### Nginx 配置问题

```powershell
# 测试配置语法
nginx -t

# 查看 Nginx 错误日志
Get-Content C:\nginx\logs\error.log
```

### SSH 连接问题

```powershell
# 检查 SSH 服务状态
Get-Service sshd

# 重启 SSH 服务
Restart-Service sshd
```

## 开机自启

### 使用任务计划程序

1. 打开 "任务计划程序"
2. 创建基本任务
3. 触发器: "计算机启动时"
4. 操作: "启动程序"
   - 后端: `powershell.exe -ExecutionPolicy Bypass -File C:\inetpub\wwwroot\blog-backend\start-service.ps1`
   - 前端: 同上，指向前端启动脚本
   - Nginx: `C:\nginx\nginx.exe`

## 安全建议

1. 修改默认管理员密码
2. 配置 Windows 防火墙
3. 定期更新系统和软件
4. 使用 HTTPS (配置 SSL 证书)
5. 定期备份数据库
