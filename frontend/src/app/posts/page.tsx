'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import request from '@/lib/request';
import { useSettings } from '@/components/providers/settings-provider';
import { getImageUrl } from '@/lib/utils';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: { name: string; slug: string };
  tags: { name: string; slug: string; color?: string }[];
  publishedAt?: string;
  createdAt: string;
  viewCount?: number;
  series?: { name: string; slug: string };
}

// 文章卡片组件
function PostCard({ post, index }: { post: Post; index: number }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDefaultGradient = (i: number) => {
    const gradients = [
      'from-cyan-500 via-blue-500 to-purple-500',
      'from-emerald-500 via-teal-500 to-cyan-500',
      'from-orange-500 via-red-500 to-pink-500',
      'from-violet-500 via-purple-500 to-fuchsia-500',
    ];
    return gradients[i % gradients.length];
  };

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block relative"
    >
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
        isTech
          ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30 hover:shadow-xl'
      }`}>
        {/* 封面图 */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.coverImage ? (
            <img
              src={getImageUrl(post.coverImage)}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getDefaultGradient(index)} flex items-center justify-center`}>
              <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* 内容 */}
        <div className="p-5">
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag.slug}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isTech
                    ? 'font-["Space_Grotesk"] bg-gray-800/50 text-gray-300'
                    : 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                }`}
              >
                {tag.name}
              </span>
            ))}
            {post.series && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                isTech
                  ? 'font-["Space_Grotesk"] bg-purple-500/20 text-purple-400'
                  : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}>
                {post.series.name}
              </span>
            )}
          </div>

          {/* 标题 */}
          <h3 className={`text-lg font-bold leading-snug mb-2 line-clamp-2 transition-colors ${
            isTech
              ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
              : 'text-gray-900 dark:text-white group-hover:text-violet-600'
          }`}>
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className={`text-sm line-clamp-2 mb-4 leading-relaxed ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {post.excerpt}
          </p>

          {/* 底部信息 */}
          <div className={`flex items-center justify-between text-xs ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-600'
              : 'text-gray-500'
          }`}>
            <time>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : new Date(post.createdAt).toLocaleDateString('zh-CN')}</time>
            {post.viewCount && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// 导航栏组件
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { settings } = useSettings();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTech = mounted && theme === 'tech';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isTech
            ? 'bg-[#030305]/80 backdrop-blur-xl border-b border-cyan-500/10'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 relative">
              <div className={`absolute inset-0 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 ${
                isTech
                  ? 'bg-gradient-to-br from-cyan-400 to-emerald-400'
                  : 'bg-gradient-to-br from-violet-500 to-blue-500'
              }`} />
              <div className={`absolute inset-0 rounded-md rotate-45 ${
                isTech ? 'bg-[#030305]' : 'bg-white'
              }`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-bold text-lg ${
                  isTech ? 'text-cyan-400' : 'text-violet-600'
                }`}>&lt;/&gt;</span>
              </div>
            </div>
          </div>
          <span className={`text-xl font-bold ${
            isTech
              ? 'font-["Orbitron"] text-white'
              : 'text-gray-900 dark:text-white'
          }`}>
            {settings.siteName}
          </span>
        </Link>

        {/* 导航链接 */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: '/posts', label: '文章' },
            { href: '/series', label: '专栏' },
            { href: '/tags', label: '标签' },
            { href: '/about', label: '关于' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors group ${
                isTech
                  ? 'font-["Space_Grotesk"] text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300 ${
                isTech ? 'bg-gradient-to-r from-cyan-400 to-emerald-400' : 'bg-violet-500'
              }`} />
            </Link>
          ))}
        </div>

        {/* 主题切换 */}
        <button
          onClick={() => setTheme(isTech ? 'light' : 'tech')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isTech
              ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
              : 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 dark:text-violet-400'
          }`}
        >
          {isTech ? '简约' : '科技'}
        </button>
      </div>
    </nav>
  );
}

// 主内容组件
function PostsPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
    const params: any = { page: 1, pageSize: 50 };
    if (category) params.category = category;
    if (tag) params.tag = tag;

    request.get('/posts', { params }).then((res) => {
      setPosts(res.data.records || []);
      setLoading(false);
    });
  }, [category, tag]);

  // 防止 hydration 不匹配，挂载前不渲染
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-6">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isTech ? 'bg-[#030305]' : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="flex flex-col items-center gap-6">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className={isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isTech
        ? 'bg-[#030305] text-white font-["Space_Grotesk"]'
        : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
    }`}>
      <Navigation />

      <main>
        {/* Hero Header */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          {/* 背景渐变 */}
          {isTech ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,212,0.15),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(255,0,110,0.1),transparent)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5" />
          )}

          <div className="relative z-10 text-center px-6">
            {/* 标签 */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
              isTech
                ? 'bg-cyan-500/5 border-cyan-500/20'
                : 'bg-violet-500/10 border-violet-500/20'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className={`text-sm font-medium ${
                isTech
                  ? 'font-["Space_Grotesk"] text-cyan-400'
                  : 'text-violet-700 dark:text-violet-300'
              }`}>
                {category ? '分类归档' : tag ? '标签归档' : '文章归档'}
              </span>
            </div>

            {/* 标题 */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isTech ? 'font-["Orbitron"] text-white' : ''
            }`}>
              <span className={isTech ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400' : 'gradient-text'}>
                {category ? category : tag ? `#${tag}` : '全部文章'}
              </span>
            </h1>

            {/* 统计 */}
            <div className={`flex items-center justify-center gap-2 text-sm ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              <span>{posts.length}</span>
              <span>篇文章</span>
            </div>
          </div>
        </section>

        {/* 文章网格 */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                  isTech
                    ? 'bg-gray-800/50'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className={isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>暂无文章</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className={`py-12 px-6 border-t text-center ${
        isTech
          ? 'border-gray-800/50'
          : 'border-gray-200 dark:border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto">
          <p className={`text-sm mb-2 ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-600'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            © 2026 Huwx.BLOG
          </p>
          <p className={`text-xs ${
            isTech
              ? 'font-["JetBrains_Mono"] text-gray-700'
              : 'text-gray-500 font-mono'
          }`}>
            Built with Next.js & Spring Boot
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-6">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    }>
      <PostsPageContent />
    </Suspense>
  );
}
