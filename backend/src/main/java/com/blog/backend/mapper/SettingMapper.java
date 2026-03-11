package com.blog.backend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.backend.entity.Setting;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SettingMapper extends BaseMapper<Setting> {
}
