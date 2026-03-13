'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import request from '@/lib/request';

interface Category {
  id: number;
  name: string;
}

interface Series {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    categoryId: '',
    seriesId: '',
    isFeatured: false,
    status: 'draft',
  });

  useEffect(() => {
    Promise.all([
      request.get(`/posts/admin/${id}`),
      request.get('/categories'),
      request.get('/series'),
      request.get('/tags'),
    ]).then(([postRes, cats, ser, ts]) => {
      const post = postRes.data;
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        coverImage: post.coverImage || '',
        categoryId: post.categoryId?.toString() || '',
        seriesId: post.seriesId?.toString() || '',
        isFeatured: post.isFeatured || false,
        status: post.status || 'draft',
      });
      setSelectedTags(post.tags?.map((t: any) => t.id) || []);
      setCategories(cats.data || []);
      setSeries(ser.data || []);
      setTags(ts.data || []);
      setFetching(false);
    }).catch(() => {
      alert('文章不存在');
      router.push('/admin/posts');
    });
  }, [id]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await request.put(`/posts/${id}`, {
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        seriesId: formData.seriesId ? parseInt(formData.seriesId) : null,
        tagIds: selectedTags,
      });
      router.push('/admin/posts');
    } catch (error: any) {
      alert('保存失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await request.post('/upload/image', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';
      const imageUrl = apiUrl.replace('/api', '') + res.data.url;
      setFormData({ ...formData, coverImage: imageUrl });
    } catch (error: any) {
      alert('上传失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async () => {
    await request.put(`/posts/${id}/publish`);
    const res = await request.get(`/posts/admin/${id}`);
    const post = res.data;
    setFormData({
      ...formData,
      status: post.status || 'draft',
    });
    alert('已发布');
  };

  const handleUnpublish = async () => {
    await request.put(`/posts/${id}/unpublish`);
    const res = await request.get(`/posts/admin/${id}`);
    const post = res.data;
    setFormData({
      ...formData,
      status: post.status || 'published',
    });
    alert('已取消发布');
  };

  if (fetching) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">编辑文章</h1>
        <div className="flex gap-2">
          {formData.status === 'published' ? (
            <button
              onClick={handleUnpublish}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
            >
              取消发布
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              发布
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">标题 *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">摘要</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">封面图片</label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 text-sm"
                  >
                    {uploading ? '上传中...' : '上传图片'}
                  </button>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="或输入图片URL"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
                {formData.coverImage && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                    <img
                      src={formData.coverImage}
                      alt="封面预览"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: '' })}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">分类与标签</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">分类</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">未分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">系列</label>
              <select
                value={formData.seriesId}
                onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">无系列</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">标签</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.id)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">内容</h2>
          <textarea
            required
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 py-2 border rounded-md font-mono text-sm"
            rows={20}
            placeholder="支持 Markdown 格式"
          />
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">设置</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium">设为精选文章</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-between">
          <Link
            href={`/posts/${formData.slug}`}
            target="_blank"
            className="px-4 py-2 border rounded-md hover:bg-gray-50 inline-block"
          >
            预览
          </Link>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
