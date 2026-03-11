'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import request from '@/lib/request';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: { name: string; slug: string };
  isFeatured: boolean;
  publishedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Series {
  id: number;
  name: string;
  slug: string;
  coverImage: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      request.get('/posts', { params: { featured: true, pageSize: 5 } }),
      request.get('/posts', { params: { page: 1, pageSize: 10, sortBy: 'published_at', sortOrder: 'desc' } }),
      request.get('/posts', { params: { pageSize: 5, sortBy: 'view_count', sortOrder: 'desc' } }),
      request.get('/series'),
      request.get('/tags'),
    ]).then(([featured, latest, popular, series, tagsRes]) => {
      setFeaturedPosts(featured.data.records || []);
      setLatestPosts(latest.data.records || []);
      setPopularPosts(popular.data.records || []);
      setSeriesList(series.data || []);
      setTags(tagsRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">精选文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700">
                      {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg group-hover:text-primary">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">最新文章</h2>
              <div className="space-y-4">
                {latestPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.slug}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md">
                    <h3 className="font-bold text-lg hover:text-primary">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside>
            {popularPosts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">热门文章</h2>
                <div className="space-y-3">
                  {popularPosts.map((post, index) => (
                    <Link key={post.id} href={`/posts/${post.slug}`} className="block">
                      <div className="flex gap-3">
                        <span className="text-2xl font-bold text-muted-foreground">{index + 1}</span>
                        <div>
                          <h4 className="font-medium hover:text-primary">{post.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {seriesList.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">系列专题</h2>
                <div className="space-y-2">
                  {seriesList.map((s) => (
                    <Link key={s.id} href={`/series/${s.slug}`} className="block bg-white dark:bg-gray-800 rounded p-3 hover:text-primary">
                      {s.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {tags.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">标签云</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm hover:bg-primary hover:text-white">
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          © 2024 我的技术博客. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
