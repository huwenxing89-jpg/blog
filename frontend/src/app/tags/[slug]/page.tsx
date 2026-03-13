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
  publishedAt: string;
  tags: { name: string; slug: string }[];
}

interface Tag {
  id: number;
  name: string;
  slug: string;
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
const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// 获取默认封面渐变
const getDefaultCover = (index: number, isTech: boolean) => {
  const techGradients = [
    'from-cyan-500 via-blue-500 to-purple-500',
    'from-emerald-500 via-teal-500 to-cyan-500',
    'from-orange-500 via-red-500 to-pink-500',
    'from-violet-500 via-purple-500 to-fuchsia-500',
  ];
  const simpleGradients = [
    'from-violet-500 via-purple-500 to-fuchsia-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-emerald-500 via-green-500 to-lime-500',
    'from-orange-500 via-amber-500 to-yellow-500',
  ];
  return (isTech ? techGradients : simpleGradients)[index % 4];
};

function TagDetailContent({ slug }: { slug: string }) {
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
    Promise.all([
      request.get(`/tags/${slug}`),
      request.get(`/posts`, { params: { tag: slug, pageSize: 100 } }),
    ]).then(([tagRes, postsRes]: any[]) => {
      setTag(tagRes.data);
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

  if (!tag) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isTech ? 'bg-[#030305]' : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
            isTech ? 'bg-gray-800/50' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-semibold mb-4 ${
            isTech ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>标签不存在</h1>
          <Link href="/tags" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isTech
              ? 'bg-cyan-500 text-white hover:bg-cyan-500/80'
              : 'bg-violet-600 text-white hover:bg-violet-600/80'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回标签列表
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
              <Link href="/tags" className="hover:text-white transition-colors">标签</Link>
              <span>/</span>
              <span className={isTech ? 'text-cyan-400' : 'text-violet-600'}>#{tag.name}</span>
            </nav>

            {/* 标签标识 */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
              isTech
                ? 'bg-cyan-500/5 border-cyan-500/20'
                : 'bg-violet-500/10 border-violet-500/20'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className={`text-sm font-medium ${
                isTech
                  ? 'font-["Space_Grotesk"] text-cyan-400'
                  : 'text-violet-700 dark:text-violet-300'
              }`}>Tag</span>
            </div>

            {/* 标签名称 */}
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isTech ? 'font-["Orbitron"]' : ''
            }`}>
              <span className={isTech ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400' : 'gradient-text'}>
                #{tag.name}
              </span>
            </h1>

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
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                  isTech
                    ? 'bg-gray-800/50'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className={isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>该标签暂无文章</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group block"
                  >
                    <div className={`h-full p-6 rounded-2xl overflow-hidden transition-all ${
                      isTech
                        ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30'
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30 hover:shadow-lg'
                    }`}>
                      {/* 封面 */}
                      <div className="relative h-40 mb-4 rounded-xl overflow-hidden">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getDefaultCover(index, isTech)}`} />
                        )}
                      </div>

                      {/* 标题 */}
                      <h2 className={`text-lg font-semibold leading-snug mb-2 line-clamp-2 transition-colors ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
                          : 'text-gray-900 dark:text-white group-hover:text-violet-600'
                      }`}>
                        {post.title}
                      </h2>

                      {/* 摘要 */}
                      {post.excerpt && (
                        <p className={`text-sm line-clamp-2 mb-4 leading-relaxed flex-1 ${
                          isTech
                            ? 'font-["Space_Grotesk"] text-gray-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {post.excerpt}
                        </p>
                      )}

                      {/* 日期 */}
                      <div className={`flex items-center gap-1 text-sm ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-gray-500'
                          : 'text-gray-500'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(post.publishedAt || post.createdAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 相关标签提示 */}
        {posts.length > 0 && (
          <section className={`py-16 px-6 ${
            isTech ? 'bg-[#0a0a0f]/30' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            <div className="max-w-7xl mx-auto text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                isTech
                  ? 'bg-pink-500/20 text-pink-400'
                  : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
              }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
              }`}>探索更多内容</h3>
              <p className={`max-w-md mx-auto mb-6 ${
                isTech
                  ? 'font-["Space_Grotesk"] text-gray-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                访问标签云发现更多感兴趣的技术话题
              </p>
              <Link
                href="/tags"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isTech
                    ? 'bg-cyan-500 text-white hover:bg-cyan-500/80'
                    : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-lg'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                浏览所有标签
              </Link>
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

export default function TagDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
      <TagDetailContent slug={use(params).slug} />
    </Suspense>
  );
}
