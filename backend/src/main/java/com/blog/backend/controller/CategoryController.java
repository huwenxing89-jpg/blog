package com.blog.backend.controller;

import com.blog.backend.common.Result;
import com.blog.backend.entity.Category;
import com.blog.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public Result<List<Category>> getAllCategories() {
        return Result.success(categoryService.getAllCategories());
    }
    
    @GetMapping("/{slug}")
    public Result<Category> getCategory(@PathVariable String slug) {
        Category category = categoryService.getCategoryBySlug(slug);
        if (category == null) {
            return Result.error(404, "分类不存在");
        }
        return Result.success(category);
    }
    
    @PostMapping
    public Result<Category> createCategory(@RequestBody Category category) {
        return Result.success(categoryService.createCategory(category));
    }
    
    @PutMapping("/{id}")
    public Result<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return Result.success(categoryService.updateCategory(id, category));
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return Result.success();
        } catch (Exception e) {
            String message = e.getMessage();
            if (message != null && message.contains("foreign key constraint")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            }
            return Result.error(500, "删除失败: " + message);
        }
    }
}
