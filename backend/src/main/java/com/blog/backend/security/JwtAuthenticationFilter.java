package com.blog.backend.security;

import com.blog.backend.auth.entity.QiankunUser;
import com.blog.backend.auth.mapper.QiankunUserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

/**
 * JWT 认证过滤器
 * 从主应用数据库（qiankun）读取用户信息，实现统一认证
 */
@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private QiankunUserMapper qiankunUserMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token) && jwtUtil.validateToken(token)) {
            // 尝试从 Token 获取用户名（主应用 Token）
            String username = jwtUtil.getUsernameFromToken(token);

            QiankunUser user = null;
            if (StringUtils.hasText(username)) {
                // 主应用 Token：根据用户名查询
                user = qiankunUserMapper.selectByUsername(username);
                log.debug("从主应用数据库查询用户: {}", username);
            }

            if (user != null) {
                // 检查用户状态：主应用中 1-启用，0-禁用
                if (user.getStatus() == null || user.getStatus() == 0) {
                    log.warn("用户已被禁用: {}", username);
                } else {
                    String role = user.getRole() != null ? user.getRole().toUpperCase() : "USER";
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                            );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("用户认证成功: {}", username);
                }
            } else {
                log.warn("未找到用户: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
