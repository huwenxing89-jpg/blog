package com.blog.backend.auth.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.backend.auth.entity.QiankunUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 主应用用户 Mapper（从 qiankun 数据库读取）
 */
@Mapper
public interface QiankunUserMapper extends BaseMapper<QiankunUser> {

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户实体
     */
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    QiankunUser selectByUsername(String username);

    /**
     * 根据 ID 查询用户
     *
     * @param id 用户ID
     * @return 用户实体
     */
    @Select("SELECT * FROM sys_user WHERE id = #{id} AND deleted = 0")
    QiankunUser selectById(Long id);
}
