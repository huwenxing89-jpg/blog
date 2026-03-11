package com.blog.backend.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.blog.backend.entity.Series;
import com.blog.backend.mapper.SeriesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeriesService {
    
    @Autowired
    private SeriesMapper seriesMapper;
    
    public List<Series> getAllSeries() {
        return seriesMapper.selectList(new QueryWrapper<Series>());
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
    
    public void deleteSeries(Long id) {
        seriesMapper.deleteById(id);
    }
}
