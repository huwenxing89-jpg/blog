package com.blog.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.backend.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface PostMapper extends BaseMapper<Post> {

    @Update("UPDATE posts SET category_id = NULL WHERE category_id = #{categoryId} AND is_deleted = 1")
    int clearCategoryForDeletedPosts(@Param("categoryId") Long categoryId);

    @Update("UPDATE posts SET series_id = NULL WHERE series_id = #{seriesId} AND is_deleted = 1")
    int clearSeriesForDeletedPosts(@Param("seriesId") Long seriesId);
}
