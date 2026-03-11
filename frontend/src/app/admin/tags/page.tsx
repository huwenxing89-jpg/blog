'use client';

import { useEffect, useState } from 'react';
import request from '@/lib/request';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '' });

  useEffect(() => {
    request.get('/tags').then((res) => {
      setTags(res.data || []);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await request.post('/tags', form);
    setShowForm(false);
    setForm({ name: '', slug: '' });
    request.get('/tags').then((res) => setTags(res.data || []));
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除吗？')) {
      await request.delete(`/tags/${id}`);
      request.get('/tags').then((res) => setTags(res.data || []));
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">标签管理</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-primary text-white px-4 py-2 rounded-md">
          {showForm ? '取消' : '新建标签'}
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
          </div>
          <button type="submit" className="mt-4 bg-primary text-white px-4 py-2 rounded-md">保存</button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 flex items-center gap-2">
            <span>{tag.name}</span>
            <button onClick={() => handleDelete(tag.id)} className="text-red-500 text-sm">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
