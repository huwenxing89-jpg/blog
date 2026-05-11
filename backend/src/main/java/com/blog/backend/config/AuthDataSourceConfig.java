package com.blog.backend.config;

import com.baomidou.mybatisplus.core.MybatisConfiguration;
import com.baomidou.mybatisplus.extension.spring.MybatisSqlSessionFactoryBean;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

/**
 * 认证数据源配置 - 主应用数据库（qiankun）
 * 用于统一用户认证
 */
@Configuration
@MapperScan(basePackages = "com.blog.backend.auth.mapper", sqlSessionFactoryRef = "authSqlSessionFactory")
public class AuthDataSourceConfig {

    @Bean(name = "authDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.auth")
    public DataSource authDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "authSqlSessionFactory")
    public SqlSessionFactory authSqlSessionFactory(@Qualifier("authDataSource") DataSource dataSource) throws Exception {
        MybatisSqlSessionFactoryBean factory = new MybatisSqlSessionFactoryBean();
        factory.setDataSource(dataSource);

        MybatisConfiguration configuration = new MybatisConfiguration();
        configuration.setMapUnderscoreToCamelCase(true);
        factory.setConfiguration(configuration);

        return factory.getObject();
    }

    @Bean(name = "authTransactionManager")
    public DataSourceTransactionManager authTransactionManager(@Qualifier("authDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "authSqlSessionTemplate")
    public SqlSessionTemplate authSqlSessionTemplate(@Qualifier("authSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
