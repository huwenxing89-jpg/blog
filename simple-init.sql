-- 插入分类
INSERT INTO categories (id, name, slug, description, sort_order, created_at) VALUES
(1, 'Frontend', 'frontend', 'Frontend development', 1, NOW()),
(2, 'Backend', 'backend', 'Backend development', 2, NOW()),
(3, 'DevOps', 'devops', 'DevOps and tools', 3, NOW());

-- 插入文章
INSERT INTO posts (title, slug, content, excerpt, cover_image, category_id, is_featured, status, view_count, word_count, published_at, created_at, updated_at) VALUES
('React Hooks Guide', 'react-hooks-guide', '# React Hooks Guide\n\nLearn React Hooks with examples.', 'A complete guide to React Hooks', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', 1, 1, 'published', 100, 500, NOW(), NOW(), NOW()),
('Spring Boot Tutorial', 'spring-boot-tutorial', '# Spring Boot Tutorial\n\nBuild REST APIs with Spring Boot.', 'Learn Spring Boot from scratch', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 2, 0, 'published', 200, 800, NOW(), NOW(), NOW()),
('Docker Basics', 'docker-basics', '# Docker Basics\n\nIntroduction to Docker containers.', 'Get started with Docker', 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800', 3, 0, 'draft', 50, 300, NOW(), NOW(), NOW());
