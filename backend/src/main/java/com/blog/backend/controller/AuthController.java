package com.blog.backend.controller;

import com.blog.backend.common.Result;
import com.blog.backend.entity.User;
import com.blog.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> params) {
        String email = params.get("email");
        String password = params.get("password");
        
        try {
            Map<String, Object> data = authService.login(email, password);
            return Result.success(data);
        } catch (Exception e) {
            return Result.error(401, e.getMessage());
        }
    }
    
    @GetMapping("/me")
    public Result<User> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return Result.error(401, "未登录");
        }
        User user = (User) authentication.getPrincipal();
        return Result.success(user);
    }
    
    @PostMapping("/logout")
    public Result<Void> logout() {
        return Result.success();
    }
}
