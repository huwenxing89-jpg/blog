package com.blog.backend.common;

import org.apache.ibatis.exceptions.PersistenceException;
import org.mybatis.spring.MyBatisSystemException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 处理MyBatis系统异常（这是MyBatis在数据库操作失败时抛出的主要异常）
    @ExceptionHandler(MyBatisSystemException.class)
    public Result<Void> handleMyBatisSystemException(MyBatisSystemException e) {
        Throwable cause = e.getCause();
        String message = cause != null ? cause.getMessage() : e.getMessage();

        // 检查是否是外键约束违反
        if (message != null && message.contains("foreign key constraint")) {
            if (message.contains("series")) {
                return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
            } else if (message.contains("categories")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            } else if (message.contains("tag")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(400, "无法删除：该数据还被其他数据引用");
        }

        return Result.error(500, "数据库操作失败: " + message);
    }

    // 处理MyBatis持久化异常
    @ExceptionHandler(PersistenceException.class)
    public Result<Void> handlePersistenceException(PersistenceException e) {
        String message = e.getMessage();

        // 检查是否是外键约束违反
        if (message != null && message.contains("foreign key constraint")) {
            if (message.contains("series")) {
                return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
            } else if (message.contains("categories")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            } else if (message.contains("tag")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(400, "无法删除：该数据还被其他数据引用");
        }

        return Result.error(500, "数据库操作失败: " + message);
    }

    // 处理SQL完整性约束违反异常
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public Result<Void> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException e) {
        String message = e.getMessage();
        if (message != null && message.contains("foreign key constraint")) {
            if (message.contains("series")) {
                return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
            } else if (message.contains("categories")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            } else if (message.contains("tag")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(400, "无法删除：该数据还被其他数据引用");
        }
        return Result.error(400, "数据完整性约束违反：" + e.getMessage());
    }

    // 处理Spring的数据完整性违反异常
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Result<Void> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        // 获取根异常原因
        Throwable rootCause = e.getRootCause();
        String message = rootCause != null ? rootCause.getMessage() : e.getMessage();

        if (message != null && message.contains("foreign key constraint")) {
            if (message.contains("series")) {
                return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
            } else if (message.contains("categories")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            } else if (message.contains("tag")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(400, "无法删除：该数据还被其他数据引用");
        }
        return Result.error(400, "数据完整性约束违反：" + message);
    }

    // 处理其他运行时异常 - 移到最后，避免捕获更具体的异常
    @ExceptionHandler(RuntimeException.class)
    public Result<Void> handleRuntimeException(RuntimeException e) {
        String exceptionMessage = e.getMessage();
        Throwable cause = e.getCause();

        // 检查异常消息中是否包含外键约束错误
        if (exceptionMessage != null && exceptionMessage.contains("foreign key constraint")) {
            if (exceptionMessage.contains("series")) {
                return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
            } else if (exceptionMessage.contains("categories")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            } else if (exceptionMessage.contains("tag")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(400, "无法删除：该数据还被其他数据引用");
        }

        // 检查cause中是否包含外键约束错误
        if (cause != null) {
            String causeMessage = cause.getMessage();
            if (causeMessage != null && causeMessage.contains("foreign key constraint")) {
                if (causeMessage.contains("series")) {
                    return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
                } else if (causeMessage.contains("categories")) {
                    return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
                } else if (causeMessage.contains("tag")) {
                    return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
                }
                return Result.error(400, "无法删除：该数据还被其他数据引用");
            }
        }

        return Result.error(500, exceptionMessage);
    }

    // 处理所有其他异常（兜底，检查所有异常消息中的外键约束）
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        // 调试标记：如果看到这个消息，说明异常处理器被调用了
        String message = e.getMessage();
        Throwable cause = e.getCause();
        String causeMessage = cause != null ? cause.getMessage() : null;

        // 检查异常消息或cause中是否包含外键约束错误
        String errorToCheck = null;
        if (message != null && message.contains("foreign key constraint")) {
            errorToCheck = message;
        } else if (causeMessage != null && causeMessage.contains("foreign key constraint")) {
            errorToCheck = causeMessage;
        }

        if (errorToCheck != null) {
            if (errorToCheck.contains("series")) {
                return Result.error(400, "无法删除：该系列下还有文章，请先删除相关文章");
            } else if (errorToCheck.contains("categories")) {
                return Result.error(400, "无法删除：该分类下还有文章，请先删除相关文章");
            } else if (errorToCheck.contains("tag")) {
                return Result.error(400, "无法删除：该标签还被文章使用，请先移除相关标签");
            }
            return Result.error(400, "无法删除：该数据还被其他数据引用");
        }

        return Result.error(500, "服务器内部错误: " + message);
    }
}
