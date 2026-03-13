# Blog 部署指南

本文档说明如何将 Blog 项目自动部署到云服务器。

## 架构概览

```
GitHub Actions --> 云服务器
     │
     ├── 前端: Next.js (端口 3000) --> Nginx (端口 80)
     ├── 后端: Spring Boot (端口 8088) --> Nginx 代理
     └── 数据库: MySQL (端口 3306)
```

**端口说明：**
- 外部访问: 80 (HTTP) / 443 (HTTPS) - 通过 Nginx 统一入口
- 前端服务: 3000 (内部)
- 后端服务: 8088 (内部)

## 前置要求

### 云服务器要求
- 操作系统: Ubuntu 20.04+ 或 CentOS 7+
- 内存: 至少 2GB
- 存储: 至少 20GB
- 已开放端口: 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 需要安装的软件
- OpenJDK 8
- Node.js 18+
- MySQL 8.0
- Nginx

## 快速开始

### 步骤 1: 配置 GitHub Secrets

在你的 GitHub 仓库中，进入 `Settings` -> `Secrets and variables` -> `Actions`，添加以下 Secrets：

#### 必需的 Secrets

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SERVER_HOST` | 服务器 IP 地址 | `123.45.67.89` |
| `SERVER_USER` | SSH 用户名 | `root` 或 `ubuntu` |
| `SERVER_PASSWORD` | SSH 登录密码 | `your_password` |
| `SERVER_PORT` | SSH 端口 | `22` |
| `DEPLOY_PATH` | 部署路径 | `/C:/inetpub/blog` |

#### 数据库配置

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `DB_HOST` | 数据库主机 | `localhost` |
| `DB_PORT` | 数据库端口 | `3306` |
| `DB_NAME` | 数据库名 | `blog` |
| `DB_USER` | 数据库用户名 | `blog_user` |
| `DB_PASSWORD` | 数据库密码 | `your_secure_password` |

#### 应用配置

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `JWT_SECRET` | JWT 密钥 (至少 256 位) | 生成方式见下方 |
| `NEXT_PUBLIC_API_URL` | 前端 API 地址 | `http://your-domain.com/api` |

### 步骤 2: 生成 JWT 密钥

```bash
# 生成 256 位以上的随机密钥
openssl rand -base64 64
```

### 步骤 3: 初始化服务器

首次部署前，需要初始化服务器环境：

```bash
# 1. 克隆仓库到服务器
git clone https://github.com/your-username/Blog.git /C:/inetpub/blog

# 2. 运行初始化脚本
cd /C:/inetpub/blog
chmod +x deploy/init-server.sh
sudo ./deploy/init-server.sh
```

### 步骤 4: 触发部署

推送代码到 `main` 分支即可自动触发部署：

```bash
git push origin main
```

或者手动触发：在 GitHub 仓库的 `Actions` 标签页，选择 `Deploy Blog to Server` workflow，点击 `Run workflow`。

## 服务器管理

### 查看服务状态

```bash
# 查看后端状态
sudo systemctl status blog-backend

# 查看前端状态
sudo systemctl status blog-frontend
```

### 查看日志

```bash
# 后端日志
tail -f /C:/inetpub/blog/logs/backend.log

# 前端日志
tail -f /C:/inetpub/blog/logs/frontend.log
```

### 重启服务

```bash
# 重启后端
sudo systemctl restart blog-backend

# 重启前端
sudo systemctl restart blog-frontend
```

## Nginx 配置

Nginx 作为反向代理，配置文件位于 `/etc/nginx/sites-available/blog`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    # 后端 API
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## HTTPS 配置 (推荐)

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 故障排查

### 常见问题

1. **SSH 连接失败**
   - 检查 `SERVER_PASSWORD` 是否正确
   - 确认服务器 SSH 端口是否开放
   - 验证用户是否有 sudo 权限
   - 确认服务器允许密码登录 (`PasswordAuthentication yes` in `/etc/ssh/sshd_config`)

2. **数据库连接失败**
   - 确认 MySQL 服务正在运行
   - 检查数据库用户权限
   - 验证 `DB_HOST`、`DB_USER`、`DB_PASSWORD` 是否正确

3. **前端构建失败**
   - 检查 `NEXT_PUBLIC_API_URL` 是否配置
   - 查看 Actions 日志获取详细错误信息

4. **后端启动失败**
   - 检查 JDK 版本是否为 8
   - 查看后端日志: `tail -f /C:/inetpub/blog/logs/backend-error.log`

## 文件结构

部署后的服务器目录结构：

```
/C:/inetpub/blog/
├── frontend/           # Next.js 前端
│   ├── .next/         # 构建输出
│   ├── public/        # 静态文件
│   └── package.json
├── backend/           # Spring Boot 后端
│   ├── backend.jar   # 可执行 JAR
│   └── application-prod.yml
├── logs/             # 日志目录
│   ├── backend.log
│   └── frontend.log
├── uploads/          # 上传文件目录
└── deploy/           # 部署脚本
    ├── init-server.sh
    └── systemd/
        ├── blog-backend.service
        └── blog-frontend.service
```

## 安全建议

1. 使用非 root 用户运行服务
2. 配置防火墙只开放必要端口
3. 定期更新系统和依赖
4. 使用 HTTPS 加密传输
5. 定期备份数据库
