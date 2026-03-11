'use client';

import { useEffect, useState } from 'react';
import request from '@/lib/request';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', sortOrder: 0 });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    request.get('/categories').then((res) => {
      setCategories(res.data || []);
      setLoading(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await request.post('/categories', form);
    setShowForm(false);
    setForm({ name: '', slug: '', description: '', sortOrder: 0 });
    loadCategories();
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除吗？')) {
      await request.delete(`/categories/${id}`);
      loadCategories();
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          {showForm ? '取消' : '新建分类'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">名称</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">排序</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-primary text-white px-4 py-2 rounded-md">
            保存
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">名称</th>
              <th className="px-6 py-3 text-left">Slug</th>
              <th className="px-6 py-3 text-left">描述</th>
              <th className="px-6 py-3 text-left">排序</th>
              <th className="px-6 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4">{cat.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{cat.slug}</td>
                <td className="px-6 py-4 text-muted-foreground">{cat.description}</td>
                <td className="px-6 py-4">{cat.sortOrder}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-500 hover:underline"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
