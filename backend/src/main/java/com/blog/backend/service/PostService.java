package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.backend.entity.*;
import com.blog.backend.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    
    @Autowired
    private PostMapper postMapper;
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @Autowired
    private SeriesMapper seriesMapper;
    
    @Autowired
    private TagMapper tagMapper;
    
    @Autowired
    private PostTagMapper postTagMapper;
    
    public Page<Post> getPosts(Integer page, Integer pageSize, String category, String series,
                                String tag, String status, Boolean featured, String sortBy, String sortOrder) {
        Page<Post> pageParam = new Page<>(page, pageSize);

        QueryWrapper<Post> wrapper = new QueryWrapper<>();

        if (category != null && !category.isEmpty()) {
            Category cat = categoryMapper.selectOne(
                    new QueryWrapper<Category>().eq("slug", category)
            );
            if (cat != null) {
                wrapper.eq("category_id", cat.getId());
            }
        }

        if (series != null && !series.isEmpty()) {
            Series s = seriesMapper.selectOne(
                    new QueryWrapper<Series>().eq("slug", series)
            );
            if (s != null) {
                wrapper.eq("series_id", s.getId());
            }
        }

        if (tag != null && !tag.isEmpty()) {
            Tag t = tagMapper.selectOne(
                    new QueryWrapper<Tag>().eq("slug", tag)
            );
            if (t != null) {
                // 通过子查询获取包含该标签的文章ID
                QueryWrapper<PostTag> postTagWrapper = new QueryWrapper<>();
                postTagWrapper.eq("tag_id", t.getId());
                postTagWrapper.select("post_id");
                List<PostTag> postTags = postTagMapper.selectList(postTagWrapper);
                if (!postTags.isEmpty()) {
                    List<Long> postIds = postTags.stream()
                            .map(PostTag::getPostId)
                            .collect(java.util.stream.Collectors.toList());
                    wrapper.in("id", postIds);
                } else {
                    // 没有文章使用该标签，返回空结果
                    wrapper.eq("id", -1);
                }
            } else {
                // 标签不存在，返回空结果
                wrapper.eq("id", -1);
            }
        }

        if (status != null && !status.isEmpty()) {
            if (!"all".equals(status)) {
                wrapper.eq("status", status);
            }
            // status = "all" 时不过滤状态，返回所有文章
        } else {
            wrapper.eq("status", "published");
        }

        if (featured != null) {
            wrapper.eq("is_featured", featured);
        }

        wrapper.eq("is_deleted", false);

        String sortColumn = "created_at";
        if ("published_at".equals(sortBy)) {
            sortColumn = "published_at";
        } else if ("view_count".equals(sortBy)) {
            sortColumn = "view_count";
        }

        wrapper.orderByDesc(sortColumn);

        Page<Post> resultPage = postMapper.selectPage(pageParam, wrapper);

        // 加载关联数据
        for (Post post : resultPage.getRecords()) {
            // 加载 category
            if (post.getCategoryId() != null) {
                Category cat = categoryMapper.selectById(post.getCategoryId());
                post.setCategory(cat);
            }
            // 加载 series
            if (post.getSeriesId() != null) {
                Series s = seriesMapper.selectById(post.getSeriesId());
                post.setSeries(s);
            }
            // 加载 tags
            List<Tag> tags = getPostTags(post.getId());
            if (tags != null) {
                post.setTags(tags);
            }
        }

        return resultPage;
    }
    
    public Post getPostBySlug(String slug) {
        QueryWrapper<Post> wrapper = new QueryWrapper<>();
        wrapper.eq("slug", slug);
        wrapper.eq("is_deleted", false);
        Post post = postMapper.selectOne(wrapper);
        if (post != null) {
            loadPostRelations(post);
        }
        return post;
    }

    public Post getPostById(Long id) {
        Post post = postMapper.selectById(id);
        if (post != null) {
            loadPostRelations(post);
        }
        return post;
    }

    private void loadPostRelations(Post post) {
        // 加载 category
        if (post.getCategoryId() != null) {
            Category cat = categoryMapper.selectById(post.getCategoryId());
            post.setCategory(cat);
        }
        // 加载 series
        if (post.getSeriesId() != null) {
            Series s = seriesMapper.selectById(post.getSeriesId());
            post.setSeries(s);
        }
        // 加载 tags
        List<Tag> tags = getPostTags(post.getId());
        if (tags != null) {
            post.setTags(tags);
        }
    }
    
    @Transactional
    public Post createPost(Post post, List<Long> tagIds) {
        post.setViewCount(0);
        post.setWordCount(calculateWordCount(post.getContent()));
        postMapper.insert(post);
        
        if (tagIds != null && !tagIds.isEmpty()) {
            for (Long tagId : tagIds) {
                PostTag postTag = new PostTag();
                postTag.setPostId(post.getId());
                postTag.setTagId(tagId);
                postTagMapper.insert(postTag);
            }
        }
        
        return post;
    }
    
    @Transactional
    public Post updatePost(Long id, Post post, List<Long> tagIds) {
        // 先获取现有文章
        Post existing = postMapper.selectById(id);
        if (existing == null) {
            return null;
        }

        // 只更新非 null 字段
        if (post.getTitle() != null) {
            existing.setTitle(post.getTitle());
        }
        if (post.getSlug() != null) {
            existing.setSlug(post.getSlug());
        }
        if (post.getContent() != null) {
            existing.setContent(post.getContent());
            existing.setWordCount(calculateWordCount(post.getContent()));
        }
        if (post.getExcerpt() != null) {
            existing.setExcerpt(post.getExcerpt());
        }
        if (post.getCoverImage() != null) {
            existing.setCoverImage(post.getCoverImage());
        }
        if (post.getCategoryId() != null) {
            existing.setCategoryId(post.getCategoryId());
        }
        if (post.getSeriesId() != null) {
            existing.setSeriesId(post.getSeriesId());
        }
        if (post.getIsFeatured() != null) {
            existing.setIsFeatured(post.getIsFeatured());
        }
        if (post.getStatus() != null) {
            existing.setStatus(post.getStatus());
        }
        if (post.getViewCount() != null) {
            existing.setViewCount(post.getViewCount());
        }

        postMapper.updateById(existing);

        // 只有在明确传入 tagIds 时才更新标签关联
        if (tagIds != null) {
            QueryWrapper<PostTag> wrapper = new QueryWrapper<>();
            wrapper.eq("post_id", id);
            postTagMapper.delete(wrapper);

            if (!tagIds.isEmpty()) {
                for (Long tagId : tagIds) {
                    PostTag postTag = new PostTag();
                    postTag.setPostId(id);
                    postTag.setTagId(tagId);
                    postTagMapper.insert(postTag);
                }
            }
        }

        return existing;
    }
    
    public void deletePost(Long id) {
        UpdateWrapper<Post> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", id);
        updateWrapper.set("is_deleted", true);
        updateWrapper.set("deleted_at", LocalDateTime.now());
        postMapper.update(null, updateWrapper);
    }
    
    public void publishPost(Long id) {
        UpdateWrapper<Post> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", id);
        updateWrapper.set("status", "published");
        updateWrapper.set("published_at", LocalDateTime.now());
        postMapper.update(null, updateWrapper);
    }

    public void unpublishPost(Long id) {
        UpdateWrapper<Post> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", id);
        updateWrapper.set("status", "draft");
        postMapper.update(null, updateWrapper);
    }
    
    public void setFeatured(Long id, Boolean featured) {
        Post post = postMapper.selectById(id);
        post.setIsFeatured(featured);
        postMapper.updateById(post);
    }
    
    public List<Post> getRelatedPosts(Long postId, Long categoryId, int limit) {
        QueryWrapper<Post> wrapper = new QueryWrapper<>();
        wrapper.eq("category_id", categoryId);
        wrapper.ne("id", postId);
        wrapper.eq("status", "published");
        wrapper.eq("is_deleted", false);
        wrapper.orderByDesc("view_count");
        wrapper.last("LIMIT " + limit);
        return postMapper.selectList(wrapper);
    }
    
    public List<Post> searchPosts(String keyword) {
        QueryWrapper<Post> wrapper = new QueryWrapper<>();
        wrapper.and(w -> w.like("title", keyword).or().like("content", keyword));
        wrapper.eq("status", "published");
        wrapper.eq("is_deleted", false);
        wrapper.orderByDesc("view_count");
        return postMapper.selectList(wrapper);
    }
    
    public List<Tag> getPostTags(Long postId) {
        QueryWrapper<PostTag> wrapper = new QueryWrapper<>();
        wrapper.eq("post_id", postId);
        List<PostTag> postTags = postTagMapper.selectList(wrapper);
        
        List<Long> tagIds = postTags.stream()
                .map(PostTag::getTagId)
                .collect(Collectors.toList());
        
        if (tagIds.isEmpty()) {
            return null;
        }
        
        return tagMapper.selectBatchIds(tagIds);
    }
    
    private int calculateWordCount(String content) {
        if (content == null || content.isEmpty()) {
            return 0;
        }
        return content.replaceAll("[^\\u4e00-\\u9fa5a-zA-Z0-9]", "").length();
    }
}
