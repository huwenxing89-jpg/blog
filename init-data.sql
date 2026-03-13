-- 清空现有数据
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE post_tags;
TRUNCATE TABLE posts;
TRUNCATE TABLE tags;
TRUNCATE TABLE series;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入管理员用户 (密码: admin123)
-- BCrypt hash generated with Spring Security BCryptPasswordEncoder
INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES
(1, 'admin@blog.com', '$2a$10$9DYYghdHE1uNPbZ83AbosOOScQGMbkvs1t492P9bz4OFKnXadIJHe', 'admin', 'ADMIN', NOW());

-- 插入分类
INSERT INTO categories (id, name, slug, description, sort_order, created_at) VALUES
(1, '前端开发', 'frontend', 'HTML、CSS、JavaScript、前端框架等技术', 1, NOW()),
(2, '后端开发', 'backend', 'Java、Spring、数据库等后端技术', 2, NOW()),
(3, 'DevOps', 'devops', 'Docker、CI/CD、服务器运维', 3, NOW()),
(4, '算法与数据结构', 'algorithm', '算法学习、数据结构、LeetCode', 4, NOW()),
(5, '工具与效率', 'tools', '开发工具、效率提升技巧', 5, NOW());

-- 插入系列
INSERT INTO series (id, name, slug, description, cover_image, created_at) VALUES
(1, 'Next.js 15 完全指南', 'nextjs-15-guide', '从零开始学习 Next.js 15 新特性', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', NOW()),
(2, 'Spring Boot 实战', 'spring-boot-in-action', 'Spring Boot 企业级应用开发实践', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', NOW()),
(3, 'TypeScript 进阶', 'typescript-advanced', '深入理解 TypeScript 高级特性', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', NOW()),
(4, '算法精讲', 'algorithm-deep-dive', '常用算法详解与实战', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', NOW());

-- 插入标签
INSERT INTO tags (id, name, slug, created_at) VALUES
(1, 'React', 'react', NOW()),
(2, 'Next.js', 'nextjs', NOW()),
(3, 'TypeScript', 'typescript', NOW()),
(4, 'Tailwind CSS', 'tailwindcss', NOW()),
(5, 'Spring Boot', 'spring-boot', NOW()),
(6, 'Java', 'java', NOW()),
(7, 'MyBatis', 'mybatis', NOW()),
(8, 'MySQL', 'mysql', NOW()),
(9, 'Docker', 'docker', NOW()),
(10, 'Git', 'git', NOW()),
(11, '算法', 'algorithm', NOW()),
(12, '数据结构', 'data-structure', NOW()),
(13, 'LeetCode', 'leetcode', NOW()),
(14, 'RESTful API', 'restful-api', NOW()),
(15, '认证授权', 'auth', NOW());

-- 插入文章
INSERT INTO posts (id, title, slug, content, excerpt, cover_image, category_id, series_id, is_featured, status, view_count, word_count, published_at, created_at, updated_at) VALUES
-- Next.js 系列文章
(1, 'Next.js 15 新特性详解', 'nextjs-15-new-features',
'# Next.js 15 新特性详解

Next.js 15 带来了许多令人兴奋的新特性，本文将详细介绍这些变化。

## 主要新特性

### 1. Turbopack 稳定版
Turbopack 现在已经非常稳定，编译速度提升了 700 倍！

### 2. 改进的 App Router
App Router 现在支持更多功能，包括更好的缓存策略。

```tsx
// 新的服务器操作语法
"use server";

export async function myAction() {
  // ...
}
```

### 3. 部分预渲染
部分预渲染让你可以混合静态和动态内容。',
'Next.js 15 带来了 Turbopack 稳定版、改进的 App Router 和部分预渲染等重大更新，本文将详细介绍这些新特性。',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 1, 1, 1, 'PUBLISHED', 1250, 3200, '2024-12-01 10:00:00', NOW(), NOW()),

(2, '使用 Server Components 优化性能', 'optimizing-with-server-components',
'# 使用 Server Components 优化性能

Server Components 是 React 18 和 Next.js 13 引入的重大特性。

## 什么是 Server Components？

Server Components 在服务器上渲染，可以减少发送到客户端的 JavaScript 代码量。

## 最佳实践

1. 数据获取在服务器完成
2. 客户端组件最小化
3. 合理使用服务器操作',
'Server Components 可以显著减少客户端 JavaScript 代码量，提升应用性能。本文介绍最佳实践。',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 1, 1, 0, 'PUBLISHED', 980, 2800, '2024-12-05 10:00:00', NOW(), NOW()),

(3, 'Next.js 路由完全指南', 'nextjs-routing-complete-guide',
'# Next.js 路由完全指南

Next.js 15 的路由系统非常强大，本文将全面介绍。

## App Router 基础

## 动态路由

## 路由组和布局',
'全面介绍 Next.js 15 的路由系统，包括 App Router、动态路由、路由组和布局等内容。',
'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 1, 1, 0, 'PUBLISHED', 850, 3500, '2024-12-10 10:00:00', NOW(), NOW()),

-- Spring Boot 系列文章
(4, 'Spring Boot 3 快速入门', 'spring-boot-3-getting-started',
'# Spring Boot 3 快速入门

Spring Boot 3 基于 Jakarta EE 9，需要 Java 17 作为最低版本。

## 创建第一个项目

## 核心注解详解

## 配置外部化',
'Spring Boot 3 带来了重大更新，本文介绍如何快速上手 Spring Boot 3 开发。',
'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 2, 2, 1, 'PUBLISHED', 2100, 2900, '2024-11-15 10:00:00', NOW(), NOW()),

(5, 'Spring Security + JWT 实现认证', 'spring-security-jwt-auth',
'# Spring Security + JWT 实现认证

## JWT 简介

## 集成步骤

### 1. 添加依赖

### 2. 配置 Spring Security

### 3. 实现 JWT 工具类

### 4. 创建认证过滤器',
'详细介绍如何使用 Spring Security 和 JWT 实现前后端分离的认证系统。',
'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 2, 2, 0, 'PUBLISHED', 1750, 4200, '2024-11-20 10:00:00', NOW(), NOW()),

(6, 'MyBatis Plus 高级用法', 'mybatis-plus-advanced',
'# MyBatis Plus 高级用法

MyBatis Plus 是 MyBatis 的增强工具，大大简化了 CRUD 操作。

## 条件构造器

## 代码生成器

## 自定义 SQL

## 分页插件',
'MyBatis Plus 可以极大提高开发效率，本文介绍其高级用法和最佳实践。',
'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 2, 2, 0, 'PUBLISHED', 1320, 3100, '2024-11-25 10:00:00', NOW(), NOW()),

-- TypeScript 系列文章
(7, 'TypeScript 泛型深入理解', 'typescript-generics-deep-dive',
'# TypeScript 泛型深入理解

泛型是 TypeScript 中最强大的特性之一。

## 基础语法

## 泛型约束

## 条件类型

## 映射类型',
'深入理解 TypeScript 泛型，包括泛型约束、条件类型和映射类型等高级特性。',
'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', 1, 3, 1, 'PUBLISHED', 1680, 3800, '2024-10-10 10:00:00', NOW(), NOW()),

(8, 'TypeScript 工具类型实战', 'typescript-utility-types',
'# TypeScript 工具类型实战

TypeScript 内置了许多实用的工具类型。

## Partial

## Required

## Readonly

## Record

## Pick 和 Omit',
'介绍 TypeScript 内置工具类型的使用方法和实战案例。',
'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', 1, 3, 0, 'PUBLISHED', 1450, 2600, '2024-10-15 10:00:00', NOW(), NOW()),

-- 算法文章
(9, '动态规划经典问题解析', 'dynamic-programming-classic-problems',
'# 动态规划经典问题解析

动态规划是算法面试中的重点和难点。

## 动态规划三要素

1. 状态定义
2. 状态转移方程
3. 初始条件

## 经典问题

### 背包问题
### 最长公共子序列
### 最长递增子序列',
'解析动态规划的经典问题，包括背包问题、最长公共子序列等。',
'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', 4, 4, 1, 'PUBLISHED', 2200, 4500, '2024-09-05 10:00:00', NOW(), NOW()),

(10, '二叉树遍历详解', 'binary-tree-traversal',
'# 二叉树遍历详解

二叉树是数据结构中的重点内容。

## 前序遍历

## 中序遍历

## 后序遍历

## 层序遍历',
'详细讲解二叉树的四种遍历方式：前序、中序、后序和层序遍历。',
'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', 4, 4, 0, 'PUBLISHED', 1890, 3200, '2024-09-10 10:00:00', NOW(), NOW()),

-- DevOps 文章
(11, 'Docker 容器化实践', 'docker-containerization-practice',
'# Docker 容器化实践

Docker 已经成为现代软件开发的标准工具。

## Docker 基础

## Dockerfile 最佳实践

## Docker Compose 多容器编排

## 部署 Spring Boot 应用',
'介绍 Docker 的基础知识、Dockerfile 编写和 Compose 编排。',
'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800', 3, NULL, 0, 'PUBLISHED', 1560, 2900, '2024-08-20 10:00:00', NOW(), NOW()),

-- 工具文章
(12, 'Git 工作流最佳实践', 'git-workflow-best-practices',
'# Git 工作流最佳实践

掌握 Git 工作流对团队协作至关重要。

## Git Flow 工作流

## GitHub Flow 工作流

## 分支管理策略

## Commit 规范',
'介绍 Git Flow 和 GitHub Flow 两种主流工作流，以及分支管理策略。',
'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800', 5, NULL, 0, 'PUBLISHED', 1780, 2700, '2024-08-10 10:00:00', NOW(), NOW()),

(13, 'RESTful API 设计规范', 'restful-api-design-specification',
'# RESTful API 设计规范

良好的 API 设计是后端开发的基础。

## 资源命名

## HTTP 方法使用

## 状态码规范

## 版本控制',
'详细讲解 RESTful API 的设计规范和最佳实践。',
'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 2, NULL, 1, 'PUBLISHED', 2450, 3300, '2024-07-15 10:00:00', NOW(), NOW()),

(14, 'VS Code 高效开发技巧', 'vscode-productivity-tips',
'# VS Code 高效开发技巧

VS Code 是最流行的代码编辑器之一。

## 必装插件

## 快捷键大全

## 代码片段配置

## 调试技巧',
'分享 VS Code 的高效使用技巧，包括插件、快捷键和调试技巧。',
'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800', 5, NULL, 0, 'PUBLISHED', 2670, 2400, '2024-07-05 10:00:00', NOW(), NOW()),

(15, 'Tailwind CSS 实用技巧', 'tailwind-css-practical-tips',
'# Tailwind CSS 实用技巧

Tailwind CSS 是一个功能类优先的 CSS 框架。

## 自定义配置

## 响应式设计

## 暗色模式

## 动画效果',
'介绍 Tailwind CSS 的实用技巧和高级用法。',
'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800', 1, NULL, 0, 'PUBLISHED', 1340, 2500, '2024-06-20 10:00:00', NOW(), NOW());

-- 插入文章标签关联
INSERT INTO post_tags (post_id, tag_id) VALUES
-- 文章1: Next.js 15 新特性
(1, 2), (1, 3),
-- 文章2: Server Components
(2, 1), (2, 2),
-- 文章3: 路由指南
(3, 2),
-- 文章4: Spring Boot 3
(4, 5), (4, 6),
-- 文章5: Spring Security + JWT
(5, 5), (5, 6), (5, 15),
-- 文章6: MyBatis Plus
(6, 5), (6, 7), (6, 8),
-- 文章7: TS 泛型
(7, 3),
-- 文章8: TS 工具类型
(8, 3),
-- 文章9: 动态规划
(9, 11), (9, 12),
-- 文章10: 二叉树
(10, 11), (10, 12), (10, 13),
-- 文章11: Docker
(11, 9),
-- 文章12: Git
(12, 10),
-- 文章13: RESTful API
(13, 14), (13, 15),
-- 文章14: VS Code
(14, 10),
-- 文章15: Tailwind CSS
(15, 4);

SELECT '数据插入完成！' as message;
SELECT COUNT(*) as post_count FROM posts;
SELECT COUNT(*) as category_count FROM categories;
SELECT COUNT(*) as tag_count FROM tags;
SELECT COUNT(*) as series_count FROM series;
