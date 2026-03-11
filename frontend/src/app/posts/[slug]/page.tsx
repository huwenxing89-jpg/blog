'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import request from '@/lib/request';

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  viewCount: number;
  wordCount: number;
  publishedAt: string;
  category: { name: string; slug: string };
  tags: { name: string; slug: string }[];
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request.get(`/posts/${slug}`).then((res) => {
      setPost(res.data);
      setLoading(false);
    });

    request.get(`/posts/${slug}/related`).then((res) => {
      setRelatedPosts(res.data || []);
    });
  }, [slug]);

  const readingTime = post ? Math.ceil(post.wordCount / 200) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">文章不存在</h1>
          <Link href="/" className="text-primary hover:underline">返回首页</Link>
        </div>
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
        <article className="max-w-4xl mx-auto">
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-lg mb-8" />
          )}
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex gap-4 text-sm text-muted-foreground mb-8">
            {post.category && (
              <Link href={`/posts?category=${post.category.slug}`} className="hover:text-primary">
                {post.category.name}
              </Link>
            )}
            <span>•</span>
            <span>{post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.viewCount} 阅读</span>
            <span>•</span>
            <span>{readingTime} 分钟阅读</span>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <Link key={tag.slug} href={`/tags/${tag.slug}`} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm hover:bg-primary hover:text-white">
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-4">相关文章</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((p) => (
                <Link key={p.id} href={`/posts/${p.slug}`} className="block bg-white dark:bg-gray-800 rounded p-4 hover:shadow">
                  <h4 className="font-medium hover:text-primary">{p.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
