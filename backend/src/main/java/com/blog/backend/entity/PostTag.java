package com.blog.backend.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("post_tags")
public class PostTag {
    private Long postId;
    private Long tagId;
}
