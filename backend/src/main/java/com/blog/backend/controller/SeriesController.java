package com.blog.backend.controller;

import com.blog.backend.common.Result;
import com.blog.backend.entity.Series;
import com.blog.backend.service.SeriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
public class SeriesController {
    
    @Autowired
    private SeriesService seriesService;
    
    @GetMapping
    public Result<List<Series>> getAllSeries() {
        return Result.success(seriesService.getAllSeries());
    }
    
    @GetMapping("/{slug}")
    public Result<Series> getSeries(@PathVariable String slug) {
        Series series = seriesService.getSeriesBySlug(slug);
        if (series == null) {
            return Result.error(404, "系列不存在");
        }
        return Result.success(series);
    }
    
    @PostMapping
    public Result<Series> createSeries(@RequestBody Series series) {
        return Result.success(seriesService.createSeries(series));
    }
    
    @PutMapping("/{id}")
    public Result<Series> updateSeries(@PathVariable Long id, @RequestBody Series series) {
        return Result.success(seriesService.updateSeries(id, series));
    }
    
    @DeleteMapping("/{id}")
    public Result<Void> deleteSeries(@PathVariable Long id) {
        seriesService.deleteSeries(id);
        return Result.success();
    }
}
