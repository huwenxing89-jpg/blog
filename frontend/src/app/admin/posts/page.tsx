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
    request.get('/posts', { params: { page: 1, pageSize: 100 } }).then((res) => {
      setPosts(res.data.records || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          新建文章
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                精选
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                创建时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">{post.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {post.isFeatured ? '⭐ 是' : '否'}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-primary hover:underline mr-3"
                  >
                    编辑
                  </Link>
                  <Link
                    href={`/posts/${post.slug}`}
                    target="_blank"
                    className="text-muted-foreground hover:underline"
                  >
                    查看
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
