package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.backend.entity.Category;
import com.blog.backend.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    public List<Category> getAllCategories() {
        return categoryMapper.selectList(
                new QueryWrapper<Category>().orderByAsc("sort_order")
        );
    }
    
    public Category getCategoryBySlug(String slug) {
        return categoryMapper.selectOne(
                new QueryWrapper<Category>().eq("slug", slug)
        );
    }
    
    public Category createCategory(Category category) {
        categoryMapper.insert(category);
        return category;
    }
    
    public Category updateCategory(Long id, Category category) {
        category.setId(id);
        categoryMapper.updateById(category);
        return category;
    }
    
    public void deleteCategory(Long id) {
        categoryMapper.deleteById(id);
    }
}
