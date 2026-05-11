package com.blog.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * JWT 工具类
 * 支持解析主应用生成的 Token
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 从 Token 获取用户 ID
     * 兼容主应用 Token（userId 在 claims 中）和本应用 Token（userId 在 subject 中）
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        if (claims == null) {
            return null;
        }

        // 先尝试从 claims 获取（主应用 Token）
        Object userId = claims.get("userId");
        if (userId instanceof Integer) {
            return ((Integer) userId).longValue();
        }
        if (userId instanceof Long) {
            return (Long) userId;
        }

        // 如果 claims 中没有，尝试从 subject 获取（本应用 Token）
        String subject = claims.getSubject();
        if (subject != null) {
            try {
                return Long.parseLong(subject);
            } catch (NumberFormatException e) {
                // subject 是用户名，不是 userId
            }
        }
        return null;
    }

    /**
     * 从 Token 获取用户名（主应用 Token）
     */
    public String getUsernameFromToken(String token) {
        Claims claims = parseToken(token);
        if (claims == null) {
            return null;
        }

        // 主应用 Token 的 subject 是 username
        return claims.getSubject();
    }

    /**
     * 从 Token 获取角色（主应用 Token）
     */
    public String getRoleFromToken(String token) {
        Claims claims = parseToken(token);
        return claims != null ? (String) claims.get("role") : null;
    }

    public String getEmailFromToken(String token) {
        Claims claims = parseToken(token);
        if (claims == null) {
            return null;
        }
        return claims.get("email", String.class);
    }

    /**
     * 解析 Token
     */
    private Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            log.warn("Token 已过期: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("不支持的 Token: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Token 格式错误: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("Token 为空: {}", e.getMessage());
        }
        return null;
    }

    public boolean validateToken(String token) {
        return parseToken(token) != null;
    }
}
