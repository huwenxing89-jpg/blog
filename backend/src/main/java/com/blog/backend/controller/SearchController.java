package com.blog.backend.controller;

import com.blog.backend.common.Result;
import com.blog.backend.entity.Post;
import com.blog.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public Result<List<Post>> search(@RequestParam String q) {
        List<Post> posts = postService.searchPosts(q);
        return Result.success(posts);
    }
}
