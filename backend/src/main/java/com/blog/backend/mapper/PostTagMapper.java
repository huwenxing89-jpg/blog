package com.blog.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.backend.entity.PostTag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostTagMapper extends BaseMapper<PostTag> {

    @Delete("DELETE FROM post_tags WHERE tag_id = #{tagId} AND post_id IN (SELECT id FROM posts WHERE is_deleted = 1)")
    int clearTagsForDeletedPostsByTag(@Param("tagId") Long tagId);
}
