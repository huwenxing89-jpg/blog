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
  const [editingId, setEditingId] = useState<number | null>(null);
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

  const resetForm = () => {
    setForm({ name: '', slug: '', description: '', sortOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (category: Category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await request.put(`/categories/${editingId}`, form);
    } else {
      await request.post('/categories', form);
    }
    resetForm();
    loadCategories();
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个分类吗？')) {
      try {
        await request.delete(`/categories/${id}`);
        loadCategories();
      } catch (error: any) {
        alert(error.message || '删除失败');
      }
    }
  };

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          新建分类
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? '编辑分类' : '新建分类'}
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
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">排序</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">排序</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat.slug}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{cat.description}</td>
                <td className="px-6 py-4">{cat.sortOrder}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-violet-600 hover:text-violet-700 px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无分类，点击&quot;新建分类&quot;添加
          </div>
        )}
      </div>
    </div>
  );
}
