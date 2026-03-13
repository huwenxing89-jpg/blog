'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import request from '@/lib/request';

interface Post {
  id: number;
  title: string;
  slug: string;
  status: string;
  isFeatured: boolean;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    request.get('/posts', { params: { page: 1, pageSize: 100, status: 'all' } }).then((res) => {
      setPosts(res.data.records || []);
      setLoading(false);
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这篇文章吗？')) {
      try {
        await request.delete(`/posts/${id}`);
        loadPosts();
      } catch (error) {
        alert('删除失败');
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return <div className="p-6">加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          新建文章
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                精选
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                创建时间
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td className="px-6 py-4 font-medium">{post.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusClass(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                </td>
                <td className="px-6 py-4">{post.isFeatured ? '⭐ 是' : '否'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-violet-600 hover:text-violet-700 px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                    >
                      编辑
                    </Link>
                    <Link
                      href={`/posts/${post.slug}`}
                      target="_blank"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      查看
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
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
        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无文章，点击"新建文章"添加
          </div>
        )}
      </div>
    </div>
  );
}
