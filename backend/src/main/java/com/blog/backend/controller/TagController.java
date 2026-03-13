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

    @PutMapping("/{id}")
    public Result<Tag> updateTag(@PathVariable Long id, @RequestBody Tag tag) {
        return Result.success(tagService.updateTag(id, tag));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteTag(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            return Result.success();
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("foreign key constraint")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(500, "删除失败: " + message);
        }
    }
}
