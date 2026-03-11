package com.blog.backend.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("posts")
public class Post {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String title;
    
    private String slug;
    
    private String content;
    
    private String excerpt;
    
    private String coverImage;
    
    private Long categoryId;
    
    private Long seriesId;
    
    private Boolean isFeatured;
    
    private String status;
    
    private Integer viewCount;
    
    private Integer wordCount;
    
    private LocalDateTime publishedAt;
    
    private LocalDateTime scheduledAt;
    
    @TableLogic
    private Boolean isDeleted;
    
    private LocalDateTime deletedAt;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableField(exist = false)
    private List<Tag> tags;
    
    @TableField(exist = false)
    private Category category;
    
    @TableField(exist = false)
    private Series series;
}
