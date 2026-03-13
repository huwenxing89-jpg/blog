'use client';

import { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { useTheme } from 'next-themes';
import request from '@/lib/request';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { useSettings } from '@/components/providers/settings-provider';

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
  series?: { name: string; slug: string };
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// 目录导航组件
function TableOfContents({ items, activeId, isTech }: { items: TocItem[], activeId: string | null, isTech: boolean }) {
  if (items.length === 0) return null;

  return (
    <nav className={`sticky top-24 p-4 rounded-xl max-h-[calc(100vh-120px)] overflow-y-auto ${
      isTech
        ? 'bg-[#0a0a0f]/50 border border-gray-800/50'
        : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
    }`}>
      <h3 className={`text-sm font-semibold mb-4 ${
        isTech ? 'text-cyan-400' : 'text-violet-600 dark:text-violet-400'
      }`}>
        目录
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-all hover:translate-x-1 ${
                item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-3' : 'pl-6'
              } ${
                activeId === item.id
                  ? isTech
                    ? 'text-cyan-400 font-medium'
                    : 'text-violet-600 dark:text-violet-400 font-medium'
                  : isTech
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// 返回顶部按钮
function BackToTop({ isTech }: { isTech: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
        isTech
          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
          : 'bg-violet-600 text-white hover:bg-violet-700'
      }`}
      aria-label="返回顶部"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

// 导航栏组件（复用）
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

function PostDetailContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';
  const contentRef = useRef<HTMLDivElement>(null);

  const currentSlugRef = useRef<string>("");

  // 解析目录
  const parseToc = useCallback((content: string) => {
    const headings: TocItem[] = [];
    const regex = /^(#{2,4})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
      headings.push({ id, text, level });
    }
    return headings;
  }, []);

  // 监听滚动更新活动目录项
  useEffect(() => {
    if (tocItems.length === 0) return;

    const handleScroll = () => {
      const headingElements = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 150;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveTocId(tocItems[i].id);
          return;
        }
      }
      setActiveTocId(tocItems[0]?.id || null);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  useEffect(() => {
    setMounted(true);
    if (currentSlugRef.current === slug) {
      return;
    }
    currentSlugRef.current = slug;

    Promise.all([
      request.get(`/posts/${slug}`),
      request.get(`/posts/${slug}/related`),
    ]).then(([postRes, relatedRes]) => {
      setPost(postRes.data);
      setTocItems(parseToc(postRes.data.content));
      setRelatedPosts(relatedRes.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [slug, parseToc]);

  const readingTime = post ? Math.ceil(post.wordCount / 200) : 0;

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

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isTech ? 'bg-[#030305]' : 'bg-white dark:bg-gray-900'
      }`}>
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
            isTech ? 'bg-gray-800/50' : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-semibold mb-4 ${
            isTech ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>文章不存在</h1>
          <Link href="/" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isTech
              ? 'bg-cyan-500 text-white hover:bg-cyan-500/80'
              : 'bg-violet-600 text-white hover:bg-violet-600/80'
          }`}>
            返回首页
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
        {/* Article Header */}
        <article className="relative">
          {/* Header */}
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className={`flex items-center gap-2 text-sm mb-6 ${
              isTech ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'
            }`}>
              <Link href="/" className="hover:text-inherit transition-colors">首页</Link>
              <span>/</span>
              <Link href="/posts" className="hover:text-inherit transition-colors">文章</Link>
              {post.category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/posts?category=${post.category.slug}`}
                    className="hover:text-inherit transition-colors"
                  >
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>

            {/* Title */}
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`}>
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className={`flex flex-wrap items-center gap-4 text-sm ${
              isTech ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'
            }`}>
              <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('zh-CN')}
              </time>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {post.viewCount} 阅读
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingTime} 分钟
              </span>
            </div>
          </div>

          {/* Content with TOC */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Series Badge */}
                {post.series && (
                  <Link
                    href={`/series/${post.series.slug}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-8 transition-all ${
                      isTech
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20'
                        : 'bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="text-sm font-medium">所属系列：{post.series.name}</span>
                  </Link>
                )}

                {/* Content */}
                <div ref={contentRef} className={`prose prose-lg max-w-none ${
                  isTech
                    ? 'prose-invert prose-headings:font-["Orbitron"] prose-code:font-["JetBrains_Mono"]'
                    : 'dark:prose-invert'
                }`}>
                  <MarkdownRenderer content={post.content} />
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className={`mt-16 pt-8 border-t ${
                    isTech ? 'border-gray-800/50' : 'border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-6">
                      <svg className={`w-5 h-5 ${
                        isTech ? 'text-cyan-400' : 'text-violet-500'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className={`text-sm font-medium ${
                        isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>文章标签</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag.slug}
                          href={`/tags/${tag.slug}`}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isTech
                              ? 'bg-[#0a0a0f] border border-gray-800/50 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
                              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-violet-500/50 hover:text-violet-600'
                          }`}
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* TOC Sidebar */}
              {tocItems.length > 0 && (
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <TableOfContents items={tocItems} activeId={activeTocId} isTech={isTech} />
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Back to Top Button */}
        <BackToTop isTech={isTech} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className={`py-16 md:py-20 mt-16 ${
            isTech ? 'bg-[#0a0a0f]/30' : 'bg-gray-50 dark:bg-gray-800/50'
          }`}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-10">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    isTech
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-bold ${
                    isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
                  }`}>相关文章</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((p) => (
                    <Link key={p.id} href={`/posts/${p.slug}`} className="group block">
                      <div className={`h-full p-6 rounded-2xl transition-all ${
                        isTech
                          ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30 hover:shadow-lg'
                      }`}>
                        <div className="flex gap-4">
                          {p.coverImage && (
                            <div className="hidden sm:block w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                              <img
                                src={p.coverImage}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold line-clamp-2 mb-2 transition-colors ${
                              isTech
                                ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
                                : 'text-gray-900 dark:text-white group-hover:text-violet-600'
                            }`}>
                              {p.title}
                            </h3>
                            {p.excerpt && (
                              <p className={`text-sm line-clamp-2 ${
                                isTech
                                  ? 'font-["Space_Grotesk"] text-gray-400'
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {p.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
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

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
      <PostDetailContent slug={use(params).slug} />
    </Suspense>
  );
}
