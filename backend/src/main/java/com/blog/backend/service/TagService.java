package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.backend.entity.Tag;
import com.blog.backend.mapper.TagMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {
    
    @Autowired
    private TagMapper tagMapper;
    
    public List<Tag> getAllTags() {
        return tagMapper.selectList(new QueryWrapper<Tag>());
    }
    
    public Tag getTagBySlug(String slug) {
        return tagMapper.selectOne(new QueryWrapper<Tag>().eq("slug", slug));
    }
    
    public Tag createTag(Tag tag) {
        tagMapper.insert(tag);
        return tag;
    }
    
    public void deleteTag(Long id) {
        tagMapper.deleteById(id);
    }
}
