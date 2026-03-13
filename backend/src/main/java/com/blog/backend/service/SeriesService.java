package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.backend.entity.Series;
import com.blog.backend.entity.Post;
import com.blog.backend.mapper.SeriesMapper;
import com.blog.backend.mapper.PostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SeriesService {

    @Autowired
    private SeriesMapper seriesMapper;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Series> getAllSeries() {
        List<Series> seriesList = seriesMapper.selectList(new QueryWrapper<Series>());

        // 为每个系列计算文章数量
        for (Series series : seriesList) {
            QueryWrapper<Post> wrapper = new QueryWrapper<>();
            wrapper.eq("series_id", series.getId());
            wrapper.eq("status", "published");
            wrapper.eq("is_deleted", false);
            long count = postMapper.selectCount(wrapper);
            series.setPostCount((int) count);
        }

        return seriesList;
    }

    public Series getSeriesBySlug(String slug) {
        return seriesMapper.selectOne(new QueryWrapper<Series>().eq("slug", slug));
    }

    public Series createSeries(Series series) {
        seriesMapper.insert(series);
        return series;
    }

    public Series updateSeries(Long id, Series series) {
        series.setId(id);
        seriesMapper.updateById(series);
        return series;
    }

    @Transactional
    public void deleteSeries(Long id) {
        // 先清除已删除文章的系列引用（使用 JdbcTemplate 执行原生 SQL）
        String sql = "UPDATE posts SET series_id = NULL WHERE series_id = ? AND is_deleted = 1";
        jdbcTemplate.update(sql, id);

        // 然后删除系列
        seriesMapper.deleteById(id);
    }
}
