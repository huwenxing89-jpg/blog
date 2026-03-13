'use client';

import { useEffect, useState, Suspense, use } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import request from '@/lib/request';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  tags: { name: string; slug: string }[];
  publishedAt: string;
  viewCount?: number;
}

interface Series {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
}

// 导航栏组件（复用）
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

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
            DEV.LOG
          </span>
        </Link>

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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

function SeriesDetailContent({ slug }: { slug: string }) {
  const [series, setSeries] = useState<Series | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
    Promise.all([
      request.get(`/series/${slug}`),
      request.get(`/posts`, { params: { series: slug, pageSize: 100 } }),
    ]).then(([seriesRes, postsRes]: any[]) => {
      setSeries(seriesRes.data);
      setPosts(postsRes.data.records || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [slug]);

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

  if (!series) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isTech ? 'bg-[#030305]' : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
            isTech ? 'bg-gray-800/50' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className={`text-2xl font-semibold mb-4 ${
            isTech ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>系列专题不存在</h1>
          <Link href="/series" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isTech
              ? 'bg-cyan-500 text-white hover:bg-cyan-500/80'
              : 'bg-violet-600 text-white hover:bg-violet-600/80'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回系列列表
          </Link>
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
          {isTech ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,212,0.15),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(255,0,110,0.1),transparent)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5" />
          )}

          <div className="relative z-10 text-center px-6">
            {/* 面包屑 */}
            <nav className={`flex items-center justify-center gap-2 text-sm mb-8 ${
              isTech ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'
            }`}>
              <Link href="/" className="hover:text-white transition-colors">首页</Link>
              <span>/</span>
              <Link href="/series" className="hover:text-white transition-colors">系列</Link>
              <span>/</span>
              <span className={isTech ? 'text-cyan-400' : 'text-violet-600'}>{series.name}</span>
            </nav>

            {/* 系列标识 */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
              isTech
                ? 'bg-cyan-500/5 border-cyan-500/20'
                : 'bg-violet-500/10 border-violet-500/20'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className={`text-sm font-medium ${
                isTech
                  ? 'font-["Space_Grotesk"] text-cyan-400'
                  : 'text-violet-700 dark:text-violet-300'
              }`}>Series</span>
            </div>

            {/* 系列名称 */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isTech ? 'font-["Orbitron"]' : ''
            }`}>
              <span className={isTech ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400' : 'gradient-text'}>
                {series.name}
              </span>
            </h1>

            {/* 系列描述 */}
            {series.description && (
              <p className={`text-lg max-w-2xl mx-auto ${
                isTech
                  ? 'font-["Space_Grotesk"] text-gray-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {series.description}
              </p>
            )}

            {/* 统计信息 */}
            <div className={`flex items-center justify-center gap-2 text-sm mt-6 ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              <span>{posts.length}</span>
              <span>篇文章</span>
            </div>
          </div>
        </section>

        {/* 文章列表 */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                  isTech
                    ? 'bg-gray-800/50'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className={isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>该系列暂无文章</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group block"
                  >
                    <div className={`p-6 rounded-2xl transition-all ${
                      isTech
                        ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30 hover:shadow-lg'
                    }`}>
                      <div className="flex gap-6">
                        {/* 序号 */}
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg ${
                          isTech
                            ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 text-white'
                            : 'bg-gradient-to-br from-violet-500 to-blue-500 text-white'
                        }`}>
                          {index + 1}
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          {/* 标题 */}
                          <h2 className={`text-xl font-semibold leading-snug mb-2 line-clamp-1 transition-colors ${
                            isTech
                              ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
                              : 'text-gray-900 dark:text-white group-hover:text-violet-600'
                          }`}>
                            {post.title}
                          </h2>

                          {/* 摘要 */}
                          {post.excerpt && (
                            <p className={`text-sm line-clamp-2 mb-3 leading-relaxed ${
                              isTech
                                ? 'font-["Space_Grotesk"] text-gray-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {post.excerpt}
                            </p>
                          )}

                          {/* 元信息 */}
                          <div className={`flex items-center gap-4 text-sm ${
                            isTech
                              ? 'font-["Space_Grotesk"] text-gray-500'
                              : 'text-gray-500'
                          }`}>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(post.publishedAt)}
                            </span>
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

                        {/* 箭头 */}
                        <div className={`flex items-center ${
                          isTech ? 'text-cyan-400' : 'text-violet-600'
                        }`}>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 学习进度提示 */}
        {posts.length > 0 && (
          <section className={`py-16 px-6 ${
            isTech ? 'bg-[#0a0a0f]/30' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            <div className="max-w-5xl mx-auto text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                isTech
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
              }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
              }`}>系统化学习路径</h3>
              <p className={`max-w-md mx-auto ${
                isTech
                  ? 'font-["Space_Grotesk"] text-gray-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                按顺序阅读本系列文章，帮助你系统掌握 {series.name} 的相关知识体系
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
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
            © 2024 Dev.Log
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

export default function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    }>
      <SeriesDetailContent slug={use(params).slug} />
    </Suspense>
  );
}
