-- 插入标签
INSERT INTO tags (id, name, slug) VALUES
(1, 'React', 'react'),
(2, 'Spring Boot', 'spring-boot'),
(3, 'Docker', 'docker')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 为文章添加标签关联
-- React Hooks Guide -> react
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (1, 1);

-- Spring Boot Tutorial -> spring-boot
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (2, 2);

-- Docker Basics -> docker
INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (3, 3);
