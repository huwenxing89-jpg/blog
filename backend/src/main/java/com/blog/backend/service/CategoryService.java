package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.backend.entity.Category;
import com.blog.backend.mapper.CategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

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

    @Transactional
    public void deleteCategory(Long id) {
        // 先清除已删除文章的分类引用（使用 JdbcTemplate 执行原生 SQL）
        String sql = "UPDATE posts SET category_id = NULL WHERE category_id = ? AND is_deleted = 1";
        int cleared = jdbcTemplate.update(sql, id);
        System.out.println("Cleared " + cleared + " deleted posts with category_id = " + id);

        // 然后删除分类
        int result = categoryMapper.deleteById(id);
        if (result == 0) {
            throw new RuntimeException("分类不存在或已被删除");
        }
    }
}
