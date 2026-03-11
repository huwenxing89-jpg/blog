package com.blog.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.backend.entity.PostTag;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostTagMapper extends BaseMapper<PostTag> {
}
