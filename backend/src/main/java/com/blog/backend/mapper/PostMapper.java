package com.blog.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.backend.entity.Post;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostMapper extends BaseMapper<Post> {
}
