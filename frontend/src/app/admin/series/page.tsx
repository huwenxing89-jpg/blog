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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', coverImage: '' });

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = () => {
    request.get('/series').then((res) => {
      setSeriesList(res.data || []);
      setLoading(false);
    });
  };

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', coverImage: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (series: Series) => {
    setForm({
      name: series.name,
      slug: series.slug,
      description: series.description,
      coverImage: series.coverImage || '',
    });
    setEditingId(series.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await request.put(`/series/${editingId}`, form);
    } else {
      await request.post('/series', form);
    }
    resetForm();
    loadSeries();
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个系列吗？')) {
      try {
        await request.delete(`/series/${id}`);
        loadSeries();
      } catch (error: any) {
        alert(error.message || '删除失败');
      }
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">系列管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          新建系列
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? '编辑系列' : '新建系列'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">名称</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">封面图URL（可选）</label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors">
              {editingId ? '更新' : '保存'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seriesList.map((s) => (
          <div key={s.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold">{s.name}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(s)}
                  className="text-violet-600 hover:text-violet-700 px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                >
                  删除
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{s.description}</p>
            {s.coverImage && (
              <img
                src={s.coverImage}
                alt={s.name}
                className="w-full h-32 object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
      {seriesList.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          暂无系列，点击&quot;新建系列&quot;添加
        </div>
      )}
    </div>
  );
}
