package com.blog.backend.service;

import com.blog.backend.entity.User;
import com.blog.backend.mapper.UserMapper;
import com.blog.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> login(String email, String password) {
        System.out.println("=== Login attempt ===");
        System.out.println("Email: " + email);

        User user = userMapper.selectOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<User>()
                        .eq("email", email)
        );

        System.out.println("User found: " + (user != null));
        if (user != null) {
            System.out.println("User ID: " + user.getId());
            System.out.println("User email: " + user.getEmail());
            System.out.println("Stored hash: " + user.getPasswordHash());
            System.out.println("Password match: " + passwordEncoder.matches(password, user.getPasswordHash()));
        }

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("邮箱或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        return result;
    }

    public User getCurrentUser(Long userId) {
        return userMapper.selectById(userId);
    }
}
