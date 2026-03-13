package com.blog.backend.controller;

import com.blog.backend.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${upload.path:uploads}")
    private String uploadPath;

    @PostMapping("/image")
    public Result<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.error(400, "请选择文件");
        }

        try {
            // 获取原始文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "unknown";
            }

            // 获取文件扩展名
            String extension = "";
            int lastDotIndex = originalFilename.lastIndexOf('.');
            if (lastDotIndex > 0) {
                extension = originalFilename.substring(lastDotIndex);
            }

            // 验证文件类型
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return Result.error(400, "只支持图片文件");
            }

            // 生成新文件名
            String newFilename = UUID.randomUUID().toString() + extension;

            // 按日期分目录存储
            String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
            Path dirPath = Paths.get(uploadPath, datePath);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            // 保存文件
            Path filePath = dirPath.resolve(newFilename);
            file.transferTo(filePath.toFile());

            // 返回访问URL
            String url = "/uploads/" + datePath + "/" + newFilename;
            Map<String, String> result = new HashMap<>();
            result.put("url", url);
            result.put("filename", newFilename);

            return Result.success(result);
        } catch (IOException e) {
            return Result.error(500, "文件上传失败: " + e.getMessage());
        }
    }
}
