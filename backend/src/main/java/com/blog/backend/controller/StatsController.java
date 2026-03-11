package com.blog.backend.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.backend.common.Result;
import com.blog.backend.entity.Post;
import com.blog.backend.entity.Category;
import com.blog.backend.mapper.PostMapper;
import com.blog.backend.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    
    @Autowired
    private PostMapper postMapper;
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @GetMapping
    public Result<Map<String, Object>> getStats() {
        QueryWrapper<Post> publishedWrapper = new QueryWrapper<>();
        publishedWrapper.eq("status", "published");
        publishedWrapper.eq("is_deleted", false);
        long totalPosts = postMapper.selectCount(publishedWrapper);
        
        QueryWrapper<Post> featuredWrapper = new QueryWrapper<>();
        featuredWrapper.eq("is_featured", true);
        featuredWrapper.eq("is_deleted", false);
        long featuredPosts = postMapper.selectCount(featuredWrapper);
        
        QueryWrapper<Post> viewCountWrapper = new QueryWrapper<>();
        viewCountWrapper.eq("status", "published");
        viewCountWrapper.eq("is_deleted", false);
        List<Post> posts = postMapper.selectList(viewCountWrapper);
        int totalViews = posts.stream().mapToInt(Post::getViewCount).sum();
        
        long totalCategories = categoryMapper.selectCount(null);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("featuredPosts", featuredPosts);
        stats.put("totalViews", totalViews);
        stats.put("totalCategories", totalCategories);
        
        return Result.success(stats);
    }
}
