package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
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
        
        if (status != null && !status.isEmpty()) {
            wrapper.eq("status", status);
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
        
        return postMapper.selectPage(pageParam, wrapper);
    }
    
    public Post getPostBySlug(String slug) {
        QueryWrapper<Post> wrapper = new QueryWrapper<>();
        wrapper.eq("slug", slug);
        wrapper.eq("is_deleted", false);
        return postMapper.selectOne(wrapper);
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
        post.setId(id);
        post.setWordCount(calculateWordCount(post.getContent()));
        postMapper.updateById(post);
        
        QueryWrapper<PostTag> wrapper = new QueryWrapper<>();
        wrapper.eq("post_id", id);
        postTagMapper.delete(wrapper);
        
        if (tagIds != null && !tagIds.isEmpty()) {
            for (Long tagId : tagIds) {
                PostTag postTag = new PostTag();
                postTag.setPostId(id);
                postTag.setTagId(tagId);
                postTagMapper.insert(postTag);
            }
        }
        
        return post;
    }
    
    public void deletePost(Long id) {
        Post post = new Post();
        post.setId(id);
        post.setIsDeleted(true);
        post.setDeletedAt(LocalDateTime.now());
        postMapper.updateById(post);
    }
    
    public void publishPost(Long id) {
        Post post = postMapper.selectById(id);
        post.setStatus("published");
        post.setPublishedAt(LocalDateTime.now());
        postMapper.updateById(post);
    }
    
    public void unpublishPost(Long id) {
        Post post = postMapper.selectById(id);
        post.setStatus("draft");
        postMapper.updateById(post);
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
