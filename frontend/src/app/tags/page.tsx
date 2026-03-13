'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import request from '@/lib/request';
import { useSettings } from '@/components/providers/settings-provider';

interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  postCount?: number;
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

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
    request.get('/tags').then((res: any) => {
      setTags(res.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const getTagSize = (count: number = 0) => {
    if (count >= 10) return { fontSize: 'text-xl', padding: 'px-5 py-3', shadow: isTech ? 'shadow-lg shadow-cyan-500/20' : 'shadow-lg' };
    if (count >= 5) return { fontSize: 'text-lg', padding: 'px-4 py-2.5', shadow: isTech ? 'shadow-md shadow-cyan-500/10' : 'shadow-md' };
    return { fontSize: 'text-base', padding: 'px-4 py-2', shadow: 'shadow-sm' };
  };

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
          {isTech ? (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,212,0.15),transparent)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(255,0,110,0.1),transparent)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5" />
          )}

          <div className="relative z-10 text-center px-6">
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
              }`}>Tags</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isTech ? 'font-["Orbitron"]' : ''
            }`}>
              <span className={isTech ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400' : 'gradient-text'}>
                标签云
              </span>
            </h1>

            <p className={`text-lg max-w-2xl mx-auto ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              通过标签探索文章，发现感兴趣的技术领域
            </p>

            <div className={`flex items-center justify-center gap-2 text-sm mt-6 ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              <span>{tags.length}</span>
              <span>个标签</span>
            </div>
          </div>
        </section>

        {/* 标签云 */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {tags.length === 0 ? (
              <div className="text-center py-20">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                  isTech
                    ? 'bg-gray-800/50'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <p className={isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>暂无标签</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {tags.map((tag) => {
                  const size = getTagSize(tag.postCount);
                  return (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className={`group relative inline-flex items-center gap-2 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                        isTech
                          ? `bg-[#0a0a0f] border border-gray-800/50 hover:border-cyan-500/50 ${size.padding} ${size.shadow}`
                          : `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/50 hover:shadow-lg ${size.padding} shadow-sm`
                      }`}
                    >
                      <span className={`font-medium transition-colors ${size.fontSize} ${
                        isTech
                          ? 'font-["Space_Grotesk"]'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {tag.name}
                      </span>
                      {tag.postCount !== undefined && tag.postCount > 0 && (
                        <span className={`text-gray-600 dark:text-gray-500 ${size.fontSize} ${
                          isTech ? 'font-["JetBrains_Mono"]' : ''
                        }`}>
                          {tag.postCount}
                        </span>
                      )}

                      {/* 悬停光效 */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={isTech && tag.color ? { background: `radial-gradient(circle at center, ${tag.color}20, transparent 70%)` }
                          : { background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 70%)' }} />
                    </Link>
                  );
                })}
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
