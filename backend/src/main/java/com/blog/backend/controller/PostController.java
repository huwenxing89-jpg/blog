package com.blog.backend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.backend.common.Result;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.Tag;
import com.blog.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public Result<Page<Post>> getPosts(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String series,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "created_at") String sortBy,
            @RequestParam(defaultValue = "desc") String sortOrder
    ) {
        Page<Post> posts = postService.getPosts(page, pageSize, category, series, tag, status, featured, sortBy, sortOrder);
        return Result.success(posts);
    }
    
    @GetMapping("/{slug}")
    public Result<Post> getPost(@PathVariable String slug) {
        Post post = postService.getPostBySlug(slug);
        if (post == null) {
            return Result.error(404, "文章不存在");
        }
        
        post.setViewCount(post.getViewCount() + 1);
        postService.updatePost(post.getId(), post, null);
        
        List<Tag> tags = postService.getPostTags(post.getId());
        if (tags != null) {
            post.setTags(tags);
        }
        
        return Result.success(post);
    }
    
    @PostMapping
    public Result<Post> createPost(@RequestBody Map<String, Object> params) {
        Post post = new Post();
        post.setTitle((String) params.get("title"));
        post.setSlug((String) params.get("slug"));
        post.setContent((String) params.get("content"));
        post.setExcerpt((String) params.get("excerpt"));
        post.setCoverImage((String) params.get("coverImage"));
        post.setCategoryId(((Number) params.get("categoryId")).longValue());
        post.setSeriesId(params.get("seriesId") != null ? ((Number) params.get("seriesId")).longValue() : null);
        post.setIsFeatured(false);
        post.setStatus((String) params.getOrDefault("status", "draft"));
        
        List<Long> tagIds = null;
        if (params.get("tagIds") != null) {
            tagIds = ((List<Number>) params.get("tagIds")).stream()
                    .map(Number::longValue)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        Post created = postService.createPost(post, tagIds);
        return Result.success(created);
    }
    
    @PutMapping("/{id}")
    public Result<Post> updatePost(@PathVariable Long id, @RequestBody Map<String, Object> params) {
        Post post = new Post();
        post.setTitle((String) params.get("title"));
        post.setSlug((String) params.get("slug"));
        post.setContent((String) params.get("content"));
        post.setExcerpt((String) params.get("excerpt"));
        post.setCoverImage((String) params.get("coverImage"));
        post.setCategoryId(((Number) params.get("categoryId")).longValue());
        post.setSeriesId(params.get("seriesId") != null ? ((Number) params.get("seriesId")).longValue() : null);
        
        List<Long> tagIds = null;
        if (params.get("tagIds") != null) {
            tagIds = ((List<Number>) params.get("tagIds")).stream()
                    .map(Number::longValue)
                    .collect(java.util.stream.Collectors.toList());
        }
        
        Post updated = postService.updatePost(id, post, tagIds);
        return Result.success(updated);
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return Result.success();
    }
    
    @PutMapping("/{id}/publish")
    public Result<Void> publishPost(@PathVariable Long id) {
        postService.publishPost(id);
        return Result.success();
    }
    
    @PutMapping("/{id}/unpublish")
    public Result<Void> unpublishPost(@PathVariable Long id) {
        postService.unpublishPost(id);
        return Result.success();
    }
    
    @PutMapping("/{id}/featured")
    public Result<Void> setFeatured(@PathVariable Long id, @RequestParam Boolean featured) {
        postService.setFeatured(id, featured);
        return Result.success();
    }
    
    @GetMapping("/{slug}/related")
    public Result<List<Post>> getRelatedPosts(@PathVariable String slug) {
        Post post = postService.getPostBySlug(slug);
        if (post == null) {
            return Result.error(404, "文章不存在");
        }
        
        List<Post> relatedPosts = postService.getRelatedPosts(post.getId(), post.getCategoryId(), 3);
        return Result.success(relatedPosts);
    }
}
