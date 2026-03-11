package com.blog.backend.controller;

import com.blog.backend.common.Result;
import com.blog.backend.entity.Tag;
import com.blog.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {
    
    @Autowired
    private TagService tagService;
    
    @GetMapping
    public Result<List<Tag>> getAllTags() {
        return Result.success(tagService.getAllTags());
    }
    
    @GetMapping("/{slug}")
    public Result<Tag> getTag(@PathVariable String slug) {
        Tag tag = tagService.getTagBySlug(slug);
        if (tag == null) {
            return Result.error(404, "标签不存在");
        }
        return Result.success(tag);
    }
    
    @PostMapping
    public Result<Tag> createTag(@RequestBody Tag tag) {
        return Result.success(tagService.createTag(tag));
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return Result.success();
    }
}
