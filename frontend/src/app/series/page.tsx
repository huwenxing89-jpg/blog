'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import request from '@/lib/request';
import { useSettings } from '@/components/providers/settings-provider';

interface Series {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  postCount: number;
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

// 系列卡片
function SeriesCard({ series, index }: { series: Series; index: number }) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGradient = (i: number) => {
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
    return (isTech ? techGradients : simpleGradients)[i % 4];
  };

  return (
    <Link href={`/series/${series.slug}`} className="group block">
      <div className={`relative h-full p-6 rounded-2xl overflow-hidden transition-all duration-500 ${
        isTech
          ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30 hover:shadow-xl'
      }`}>
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* 背景图 */}
        {series.coverImage && (
          <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
            <img
              src={series.coverImage}
              alt={series.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 内容 */}
        <div className="relative z-10 h-full flex flex-col">
          {/* 图标 */}
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 backdrop-blur-sm transition-transform duration-300 ${
            isTech
              ? 'bg-gray-800/50 text-cyan-400'
              : 'bg-white/50 dark:bg-black/20 text-violet-600 dark:text-violet-400'
          }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          {/* 标题 */}
          <h3 className={`text-xl font-bold mb-3 line-clamp-1 transition-colors ${
            isTech
              ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
              : 'text-gray-900 dark:text-white group-hover:text-violet-600'
          }`}>
            {series.name}
          </h3>

          {/* 描述 */}
          {series.description && (
            <p className={`text-sm line-clamp-2 mb-4 flex-1 leading-relaxed ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {series.description}
            </p>
          )}

          {/* 底部信息 */}
          <div className={`flex items-center justify-between text-sm ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-500'
              : 'text-gray-500'
          }`}>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{series.postCount || 0} 篇</span>
            </div>
            <span className={`flex items-center gap-1 transition-colors ${
              isTech ? 'group-hover:text-cyan-400' : 'group-hover:text-violet-600'
            }`}>
              查看
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
    request.get('/series').then((res: any) => {
      setSeriesList(res.data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className={`text-sm font-medium ${
                isTech
                  ? 'font-["Space_Grotesk"] text-cyan-400'
                  : 'text-violet-700 dark:text-violet-300'
              }`}>Series</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isTech ? 'font-["Orbitron"]' : ''
            }`}>
              <span className={isTech ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400' : 'gradient-text'}>
                系列专题
              </span>
            </h1>

            <p className={`text-lg max-w-2xl mx-auto ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              系统化的学习路径，深入探索技术领域的知识体系
            </p>

            <div className={`flex items-center justify-center gap-2 text-sm mt-6 ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              <span>{seriesList.length}</span>
              <span>个系列</span>
            </div>
          </div>
        </section>

        {/* 系列卡片网格 */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {seriesList.length === 0 ? (
              <div className="text-center py-20">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
                  isTech
                    ? 'bg-gray-800/50'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className={isTech ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}>暂无系列专题</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seriesList.map((series, index) => (
                  <SeriesCard key={series.id} series={series} index={index} />
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
