'use client';

import { useEffect, useState } from 'react';
import request from '@/lib/request';

interface Stats {
  totalPosts: number;
  featuredPosts: number;
  totalViews: number;
  totalCategories: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    request.get('/stats').then((res) => {
      setStats(res.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">总文章数</div>
          <div className="text-3xl font-bold">{stats?.totalPosts || 0}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">精选文章</div>
          <div className="text-3xl font-bold">{stats?.featuredPosts || 0}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">总浏览量</div>
          <div className="text-3xl font-bold">{stats?.totalViews || 0}</div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">分类数量</div>
          <div className="text-3xl font-bold">{stats?.totalCategories || 0}</div>
        </div>
      </div>
    </div>
  );
}
