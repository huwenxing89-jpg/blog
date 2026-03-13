package com.blog.backend.controller;

import com.blog.backend.common.Result;
import com.blog.backend.service.SettingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    @Autowired
    private SettingService settingService;

    /**
     * 获取所有设置（公开接口，前端用户端和管理端都可调用）
     */
    @GetMapping
    public Result<Map<String, String>> getAllSettings() {
        return Result.success(settingService.getAllSettings());
    }

    /**
     * 获取单个设置
     */
    @GetMapping("/{key}")
    public Result<String> getSetting(@PathVariable String key) {
        String value = settingService.getSetting(key);
        return Result.success(value);
    }

    /**
     * 保存设置（管理端使用）
     */
    @PutMapping
    public Result<Void> saveSettings(@RequestBody Map<String, String> settings) {
        settingService.saveSettings(settings);
        return Result.success();
    }

    /**
     * 保存单个设置
     */
    @PutMapping("/{key}")
    public Result<Void> saveSetting(@PathVariable String key, @RequestBody String value) {
        settingService.saveSetting(key, value);
        return Result.success();
    }
}
