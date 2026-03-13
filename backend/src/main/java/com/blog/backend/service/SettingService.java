package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.backend.entity.Setting;
import com.blog.backend.mapper.SettingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SettingService {

    @Autowired
    private SettingMapper settingMapper;

    // 默认设置
    private static final Map<String, String> DEFAULT_SETTINGS = new HashMap<String, String>() {{
        put("siteName", "我的技术博客");
        put("siteDescription", "分享技术知识与学习心得");
        put("siteUrl", "https://example.com");
        put("postsPerPage", "10");
        put("enableComments", "true");
        put("analyticsId", "");
    }};

    /**
     * 获取所有设置
     */
    public Map<String, String> getAllSettings() {
        List<Setting> settings = settingMapper.selectList(null);
        Map<String, String> result = new HashMap<>(DEFAULT_SETTINGS);

        for (Setting setting : settings) {
            result.put(setting.getSettingKey(), setting.getSettingValue());
        }

        return result;
    }

    /**
     * 获取单个设置
     */
    public String getSetting(String key) {
        QueryWrapper<Setting> wrapper = new QueryWrapper<>();
        wrapper.eq("setting_key", key);
        Setting setting = settingMapper.selectOne(wrapper);

        if (setting != null) {
            return setting.getSettingValue();
        }

        return DEFAULT_SETTINGS.get(key);
    }

    /**
     * 保存设置
     */
    public void saveSettings(Map<String, String> settings) {
        for (Map.Entry<String, String> entry : settings.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            QueryWrapper<Setting> wrapper = new QueryWrapper<>();
            wrapper.eq("setting_key", key);
            Setting existing = settingMapper.selectOne(wrapper);

            if (existing != null) {
                existing.setSettingValue(value);
                settingMapper.updateById(existing);
            } else {
                Setting setting = new Setting();
                setting.setSettingKey(key);
                setting.setSettingValue(value);
                settingMapper.insert(setting);
            }
        }
    }

    /**
     * 保存单个设置
     */
    public void saveSetting(String key, String value) {
        QueryWrapper<Setting> wrapper = new QueryWrapper<>();
        wrapper.eq("setting_key", key);
        Setting existing = settingMapper.selectOne(wrapper);

        if (existing != null) {
            existing.setSettingValue(value);
            settingMapper.updateById(existing);
        } else {
            Setting setting = new Setting();
            setting.setSettingKey(key);
            setting.setSettingValue(value);
            settingMapper.insert(setting);
        }
    }
}
