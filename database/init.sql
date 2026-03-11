-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog;

-- 管理员用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT '邮箱',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `name` VARCHAR(100) COMMENT '姓名',
  `role` VARCHAR(20) DEFAULT 'admin' COMMENT '角色: admin/editor',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员用户表';

-- 内容分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(50) UNIQUE NOT NULL COMMENT 'URL别名',
  `description` TEXT COMMENT '分类描述',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='内容分类表';

-- 系列专题表
CREATE TABLE IF NOT EXISTS `series` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '系列ID',
  `name` VARCHAR(100) NOT NULL COMMENT '系列名称',
  `slug` VARCHAR(100) UNIQUE NOT NULL COMMENT 'URL别名',
  `description` TEXT COMMENT '系列描述',
  `cover_image` VARCHAR(500) COMMENT '封面图',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系列专题表';

-- 文章表
CREATE TABLE IF NOT EXISTS `posts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '文章ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `slug` VARCHAR(200) UNIQUE NOT NULL COMMENT 'URL别名',
  `content` TEXT NOT NULL COMMENT '内容',
  `excerpt` TEXT COMMENT '摘要',
  `cover_image` VARCHAR(500) COMMENT '封面图',
  `category_id` BIGINT COMMENT '分类ID',
  `series_id` BIGINT COMMENT '系列ID',
  `is_featured` TINYINT(1) DEFAULT 0 COMMENT '是否精选',
  `status` VARCHAR(20) DEFAULT 'draft' COMMENT '状态: draft/published/scheduled/trash',
  `view_count` INT DEFAULT 0 COMMENT '浏览量',
  `word_count` INT DEFAULT 0 COMMENT '字数',
  `published_at` DATETIME COMMENT '发布时间',
  `scheduled_at` DATETIME COMMENT '定时发布时间',
  `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除（回收站）',
  `deleted_at` DATETIME COMMENT '删除时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON DELETE SET NULL,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_series` (`series_id`),
  INDEX `idx_published` (`published_at`),
  INDEX `idx_deleted` (`is_deleted`),
  INDEX `idx_scheduled` (`scheduled_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 标签表
CREATE TABLE IF NOT EXISTS `tags` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `slug` VARCHAR(50) UNIQUE NOT NULL COMMENT 'URL别名',
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS `post_tags` (
  `post_id` BIGINT NOT NULL COMMENT '文章ID',
  `tag_id` BIGINT NOT NULL COMMENT '标签ID',
  PRIMARY KEY (`post_id`, `tag_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章标签关联表';

-- 系统设置表
CREATE TABLE IF NOT EXISTS `settings` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '设置ID',
  `setting_key` VARCHAR(50) UNIQUE NOT NULL COMMENT '设置键',
  `setting_value` TEXT COMMENT '设置值',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统设置表';

-- 初始化默认设置
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('theme_mode', 'auto'),
('site_title', '我的技术博客'),
('site_description', '一个专注于技术分享的博客'),
('posts_per_page', '10'),
('enable_rss', '1'),
('enable_comment', '0');

-- 初始化默认管理员 (密码: admin123)
INSERT INTO `users` (`email`, `password_hash`, `name`, `role`) VALUES
('admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '管理员', 'admin');

-- 初始化示例分类
INSERT INTO `categories` (`name`, `slug`, `description`, `sort_order`) VALUES
('前端', 'frontend', '前端技术相关文章', 1),
('后端', 'backend', '后端技术相关文章', 2),
('工具', 'tools', '开发工具相关文章', 3),
('随笔', 'notes', '个人随笔心得', 4);

-- 初始化示例系列
INSERT INTO `series` (`name`, `slug`, `description`) VALUES
('Vue3系列', 'vue3-series', 'Vue3 从入门到实战系列教程'),
('React系列', 'react-series', 'React 学习笔记与实践'),
('Spring Boot系列', 'spring-boot-series', 'Spring Boot 入门与进阶');

-- 初始化示例标签
INSERT INTO `tags` (`name`, `slug`) VALUES
('JavaScript', 'javascript'),
('TypeScript', 'typescript'),
('Vue', 'vue'),
('React', 'react'),
('Node.js', 'nodejs'),
('Python', 'python'),
('Java', 'java'),
('Spring Boot', 'spring-boot'),
('Docker', 'docker'),
('Git', 'git');

-- 初始化示例文章
INSERT INTO `posts` (`title`, `slug`, `content`, `excerpt`, `cover_image`, `category_id`, `series_id`, `is_featured`, `status`, `view_count`, `published_at`) VALUES
('Vue3 Composition API 入门指南', 'vue3-composition-api', '## 什么是 Composition API\n\nVue3 引入了一种新的 API 风格，叫做 Composition API。它提供了一种更灵活的方式来组织组件逻辑。\n\n### setup() 函数\n\n所有 Composition API 都在 setup() 函数中使用...', '本文介绍 Vue3 Composition API 的基本用法', 'https://picsum.photos/800/400', 1, 1, true, 'published', 100, NOW()),
('Spring Boot 快速入门', 'spring-boot-quick-start', '## Spring Boot 简介\n\nSpring Boot 是 Spring 家族中的一个框架，它简化了 Spring 应用的配置和部署。\n\n### 创建第一个 Spring Boot 应用\n\n1. 使用 Spring Initializr\n2. 选择依赖\n3. 编写代码', '本文介绍如何快速搭建一个 Spring Boot 项目', 'https://picsum.photos/800/401', 2, 3, true, 'published', 80, NOW()),
('Git 常用命令总结', 'git-common-commands', '## 基本命令\n\n### git init\n初始化一个 Git 仓库\n\n### git clone\n克隆远程仓库\n\n### git add\n添加文件到暂存区', 'Git 是目前最流行的版本控制系统，本文总结常用命令', 'https://picsum.photos/800/402', 3, NULL, false, 'published', 50, NOW());
