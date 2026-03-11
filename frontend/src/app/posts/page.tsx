'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import request from '@/lib/request';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
}

export default function PostsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params: any = { page: 1, pageSize: 20 };
    if (category) params.category = category;
    if (tag) params.tag = tag;
    
    request.get('/posts', { params }).then((res) => {
      setPosts(res.data.records || []);
      setLoading(false);
    });
  }, [category, tag]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">加载中...</div>;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">我的技术博客</Link>
          <nav className="flex gap-4">
            <Link href="/posts" className="hover:text-primary">文章</Link>
            <Link href="/series" className="hover:text-primary">系列</Link>
            <Link href="/tags" className="hover:text-primary">标签</Link>
            <Link href="/about" className="hover:text-primary">关于</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">文章列表</h1>
        
        {posts.length === 0 ? (
          <p className="text-muted-foreground">暂无文章</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700">
                    {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg group-hover:text-primary">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
