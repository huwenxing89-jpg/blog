-- 修复状态值为小写
UPDATE posts SET status = 'published' WHERE status = 'PUBLISHED';
UPDATE posts SET status = 'draft' WHERE status = 'DRAFT';

-- 验证结果
SELECT id, title, status FROM posts LIMIT 10;
