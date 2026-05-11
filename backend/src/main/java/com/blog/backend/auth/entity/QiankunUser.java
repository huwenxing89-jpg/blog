package com.blog.backend.auth.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 主应用用户实体类（从 qiankun 数据库读取）
 * 用于统一认证
 */
@Data
@TableName("sys_user")
public class QiankunUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;

    private String password;

    private String email;

    private String phone;

    private String avatar;

    /**
     * 状态：1启用 0禁用
     */
    private Integer status;

    /**
     * 角色：admin/user
     */
    private String role;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableLogic
    private Integer deleted;
}
