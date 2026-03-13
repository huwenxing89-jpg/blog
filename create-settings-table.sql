-- 创建设置表
CREATE TABLE IF NOT EXISTS `settings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL COMMENT '设置键',
  `setting_value` TEXT COMMENT '设置值',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- 插入默认设置
INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('siteName', '我的技术博客'),
('siteDescription', '分享技术知识与学习心得'),
('siteUrl', 'https://example.com'),
('postsPerPage', '10'),
('enableComments', 'true'),
('analyticsId', '')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);
