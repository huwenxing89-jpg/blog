package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.backend.entity.Tag;
import com.blog.backend.entity.PostTag;
import com.blog.backend.mapper.TagMapper;
import com.blog.backend.mapper.PostTagMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private PostTagMapper postTagMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Tag> getAllTags() {
        List<Tag> tags = tagMapper.selectList(new QueryWrapper<Tag>());

        // 为每个标签计算文章数量（只统计未删除的文章）
        String sql = "SELECT COUNT(*) FROM post_tags pt " +
                     "INNER JOIN posts p ON pt.post_id = p.id " +
                     "WHERE pt.tag_id = ? AND p.is_deleted = 0";

        for (Tag tag : tags) {
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tag.getId());
            tag.setPostCount(count != null ? count : 0);
        }

        return tags;
    }

    public Tag getTagBySlug(String slug) {
        return tagMapper.selectOne(new QueryWrapper<Tag>().eq("slug", slug));
    }

    public Tag createTag(Tag tag) {
        tagMapper.insert(tag);
        return tag;
    }

    public Tag updateTag(Long id, Tag tag) {
        tag.setId(id);
        tagMapper.updateById(tag);
        return tag;
    }

    @Transactional
    public void deleteTag(Long id) {
        // 先删除已删除文章的标签关联记录（使用 JdbcTemplate 执行原生 SQL）
        String sql = "DELETE FROM post_tags WHERE tag_id = ? AND post_id IN (SELECT id FROM posts WHERE is_deleted = 1)";
        jdbcTemplate.update(sql, id);

        // 然后删除标签
        tagMapper.deleteById(id);
    }
}
