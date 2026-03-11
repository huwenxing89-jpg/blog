'use client';

import { useEffect, useState } from 'react';
import request from '@/lib/request';

interface Series {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
}

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', coverImage: '' });

  useEffect(() => {
    request.get('/series').then((res) => {
      setSeriesList(res.data || []);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await request.post('/series', form);
    setShowForm(false);
    setForm({ name: '', slug: '', description: '', coverImage: '' });
    request.get('/series').then((res) => setSeriesList(res.data || []));
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除吗？')) {
      await request.delete(`/series/${id}`);
      request.get('/series').then((res) => setSeriesList(res.data || []));
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">系列管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-md">
          {showForm ? '取消' : '新建系列'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">名称</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">描述</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">封面图URL</label>
              <input type="text" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700" />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-primary text-white px-4 py-2 rounded-md">保存</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seriesList.map((s) => (
          <div key={s.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-bold">{s.name}</h3>
            <p className="text-sm text-muted-foreground">{s.description}</p>
            <button onClick={() => handleDelete(s.id)} className="mt-2 text-red-500 text-sm">删除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
