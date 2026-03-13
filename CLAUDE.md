# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个前后端分离的博客系统：
- **前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **后端**: Spring Boot 2.7.18 + MyBatis Plus + MySQL

## 项目结构

```
Blog/
├── frontend/          # Next.js 前端 (端口 3000)
│   ├── src/
│   │   ├── app/      # App Router 页面
│   │   ├── components/
│   │   ├── lib/      # 工具函数和请求封装
│   │   └── store/    # Zustand 状态管理
│   └── package.json
└── backend/          # Spring Boot 后端 (端口 8080)
    ├── src/main/java/com/blog/backend/
    │   ├── controller/   # REST API 控制器
    │   ├── service/      # 业务逻辑层
    │   ├── mapper/       # MyBatis Plus 数据访问层
    │   ├── entity/       # 数据库实体
    │   ├── security/     # JWT 认证
    │   ├── config/       # 配置类
    │   └── common/       # 通用类 (Result, 异常处理)
    └── pom.xml
```

## 常用命令

### 前端 (frontend/)
```bash
cd frontend

# 开发模式
npm run dev          # 启动开发服务器 (http://localhost:3000)

# 构建
npm run build        # 生产构建
npm run start        # 启动生产服务器

# 代码检查
npm run lint         # ESLint 检查
```

### 后端 (backend/)
```bash
cd backend

# 开发模式
mvn spring-boot:run  # 启动开发服务器 (http://localhost:8080)

# 构建
mvn clean package    # 打包
mvn test             # 运行测试

# API 文档
# 访问 http://localhost:8080/swagger-ui.html
```

## 架构说明

### 前端架构
- **App Router**: 使用 Next.js 15 的 App Router
- **状态管理**: Zustand (store/auth.ts 用于认证状态)
- **HTTP 客户端**: Axios 封装在 lib/request.ts，自动注入 JWT token
- **路由**:
  - `/admin/*` - 管理后台 (需要认证)
  - `/posts/[slug]` - 博客文章详情
  - `/` - 首页
- **暗色模式**: 使用 next-themes

### 后端架构
- **分层架构**: Controller → Service → Mapper
- **认证**: JWT + Spring Security，公开接口包括 `/api/auth/**`, `/api/posts/**` 等
- **数据库**: MyBatis Plus，逻辑删除字段 `isDeleted`
- **API 文档**: Swagger UI (http://localhost:8080/swagger-ui.html)

### 数据库
- 本地 MySQL: `localhost:3306/blog`
- 用户名: `root`，密码: `123456`
- 时区: `Asia/Shanghai`

## 环境变量

### 前端 (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 后端 (application.yml)
- 服务器端口: `8080`
- JWT 有效期: 7 天
- 数据库配置见 `backend/src/main/resources/application.yml`

## TypeScript 路径别名
- `@/*` 映射到 `./src/*`

## 技术栈
- **前端**: Next.js 15, React 19, TypeScript, Tailwind CSS, Radix UI, Zustand
- **后端**: Spring Boot, MyBatis Plus, MySQL, JWT, Swagger
- **认证**: JWT Bearer Token 存储 localStorage
