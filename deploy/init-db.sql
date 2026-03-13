-- =====================================================
-- Blog 数据库初始化脚本 (纯 SQL 版本)
-- 使用方法: mysql -u root -p < init-db.sql
-- =====================================================

-- 设置客户端编码
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog;

-- ==================== 表结构 ====================

-- 管理员用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `email` VARCHAR(255) UNIQUE NOT NULL COMMENT '邮箱',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `name` VARCHAR(100) COMMENT '姓名',
  `role` VARCHAR(20) DEFAULT 'admin' COMMENT '角色: ADMIN/EDITOR',
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
  `content` LONGTEXT NOT NULL COMMENT '内容',
  `excerpt` TEXT COMMENT '摘要',
  `cover_image` VARCHAR(500) COMMENT '封面图',
  `category_id` BIGINT COMMENT '分类ID',
  `series_id` BIGINT COMMENT '系列ID',
  `is_featured` TINYINT(1) DEFAULT 0 COMMENT '是否精选',
  `status` VARCHAR(20) DEFAULT 'DRAFT' COMMENT '状态: DRAFT/PUBLISHED/SCHEDULED/TRASH',
  `view_count` INT DEFAULT 0 COMMENT '浏览量',
  `word_count` INT DEFAULT 0 COMMENT '字数',
  `published_at` DATETIME COMMENT '发布时间',
  `scheduled_at` DATETIME COMMENT '定时发布时间',
  `is_deleted` TINYINT(1) DEFAULT 0 COMMENT '是否删除',
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
  INDEX `idx_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- 标签表
CREATE TABLE IF NOT EXISTS `tags` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '标签ID',
  `name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `slug` VARCHAR(50) UNIQUE NOT NULL COMMENT 'URL别名',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
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

-- ==================== 初始数据 ====================

-- 管理员用户 (密码: admin123)
INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES
(1, 'admin@blog.com', '$2a$10$9DYYghdHE1uNPbZ83AbosOOScQGMbkvs1t492P9bz4OFKnXadIJHe', 'admin', 'ADMIN', NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- 分类
INSERT INTO categories (id, name, slug, description, sort_order, created_at) VALUES
(1, '前端开发', 'frontend', 'HTML、CSS、JavaScript、前端框架等技术', 1, NOW()),
(2, '后端开发', 'backend', 'Java、Spring、数据库等后端技术', 2, NOW()),
(3, 'DevOps', 'devops', 'Docker、CI/CD、服务器运维', 3, NOW()),
(4, '算法与数据结构', 'algorithm', '算法学习、数据结构、LeetCode', 4, NOW()),
(5, '工具与效率', 'tools', '开发工具、效率提升技巧', 5, NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 系列
INSERT INTO series (id, name, slug, description, cover_image, created_at) VALUES
(1, 'Next.js 15 完全指南', 'nextjs-15-guide', '从零开始学习 Next.js 15 新特性', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', NOW()),
(2, 'Spring Boot 实战', 'spring-boot-in-action', 'Spring Boot 企业级应用开发实践', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', NOW()),
(3, 'TypeScript 进阶', 'typescript-advanced', '深入理解 TypeScript 高级特性', 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800', NOW()),
(4, '算法精讲', 'algorithm-deep-dive', '常用算法详解与实战', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 标签
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
(15, '认证授权', 'auth', NOW())
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 系统设置
INSERT INTO settings (setting_key, setting_value) VALUES
('theme_mode', 'auto'),
('site_title', '我的技术博客'),
('site_description', '一个专注于技术分享的博客'),
('posts_per_page', '10'),
('enable_rss', '1'),
('enable_comment', '0')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- ==================== 完成提示 ====================
SELECT '========================================' as '';
SELECT '数据库初始化完成！' as message;
SELECT '========================================' as '';
SELECT '管理员账号: admin@blog.com' as login_info;
SELECT '管理员密码: admin123' as password_info;
SELECT '请及时修改默认密码！' as warning;
