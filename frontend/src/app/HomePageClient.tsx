'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSettings } from '@/components/providers/settings-provider';
import { ClipPathImage } from '@/components/ClipPathImage';

// ==================== 类型定义 ====================
export interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
  tags: { id: number; name: string; slug: string; color: string }[];
  series: { id: number; name: string; slug: string } | null;
}

export interface Series {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string | null;
  postCount: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

// ==================== 客户端组件 ====================

interface HomePageClientProps {
  posts: Post[];
  series: Series[];
  tags: Tag[];
}

// 导航栏
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
            : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800'
          : isTech ? 'bg-transparent' : 'bg-transparent'
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
          <span className={`text-xl font-bold group-hover:opacity-80 transition-colors ${
            isTech
              ? 'font-["Orbitron"] text-white group-hover:text-cyan-400'
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
        <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
}

// Hero 区域
function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const fullText = '构建未来的数字体验';
  const [cursorVisible, setCursorVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { settings } = useSettings();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    const cursorTimer = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* 背景渐变 */}
      {isTech ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,212,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(255,0,110,0.1),transparent)]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5" />
      )}

      {/* 浮动几何图形 - 仅科技风 */}
      {isTech && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-64 h-64 border border-cyan-500/10 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 内容 */}
      <div className="relative z-10 text-center px-6 max-w-5xl pt-8 md:pt-0">
        {/* 标签 */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 ${
          isTech
            ? 'bg-cyan-500/5 border-cyan-500/20'
            : 'bg-violet-500/10 border-violet-500/20'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            isTech ? 'bg-cyan-400' : 'bg-violet-500'
          }`} />
          <span className={`text-sm ${
            isTech
              ? 'font-["Space_Grotesk"] text-cyan-400'
              : 'text-violet-700 dark:text-violet-300'
          }`}>
            全栈开发 · 技术分享 · 架构设计
          </span>
        </div>

        {/* 主标题 */}
        <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight ${
          isTech ? 'font-["Orbitron"] text-white' : ''
        }`}>
          <span className={`inline-block hover:opacity-80 transition-colors cursor-default ${
            isTech ? 'text-white hover:text-cyan-400' : 'gradient-text'
          }`}>代码</span>
          <span className={`inline-block ${
            isTech
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400'
              : 'text-gray-900 dark:text-white'
          }`}> 创造世界</span>
        </h1>

        {/* 打字机副标题 */}
        <div className={`text-2xl md:text-3xl mb-12 h-10 ${
          isTech ? 'font-["Space_Grotesk"] text-gray-400' : 'text-gray-600 dark:text-gray-400'
        }`}>
          <span className={isTech ? 'text-white' : 'text-gray-900 dark:text-white'}>{displayText}</span>
          <span
            className={`inline-block w-0.5 h-8 ml-1 align-middle ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            } transition-opacity ${isTech ? 'bg-cyan-400' : 'bg-violet-500'}`}
          />
        </div>

        {/* 描述 */}
        <p className={`text-lg leading-relaxed max-w-2xl mx-auto mb-12 ${
          isTech
            ? 'font-["Space_Grotesk"] text-gray-400'
            : 'text-gray-600 dark:text-gray-400'
        }`}>
          {settings.siteDescription}
        </p>

        {/* CTA 按钮组 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/posts"
            className={`group relative px-8 py-4 rounded-lg font-semibold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
              isTech
                ? 'font-["Space_Grotesk"] bg-gradient-to-r from-cyan-500 to-emerald-500 hover:shadow-cyan-500/25'
                : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:shadow-violet-500/25'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              浏览文章
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
              isTech
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                : 'bg-gradient-to-r from-blue-600 to-violet-600'
            }`} />
          </Link>

          <Link
            href="/about"
            className={`group px-8 py-4 border rounded-lg font-semibold transition-all hover:scale-105 ${
              isTech
                ? 'font-["Space_Grotesk"] border-gray-700 text-gray-300 hover:border-cyan-500/50 hover:text-white'
                : 'border-gray-300 text-gray-700 hover:border-violet-500/50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-300'
            }`}
          >
            关于
          </Link>
        </div>

        {/* 图片 clip-path 效果 */}
        <div className="mt-20 flex justify-center">
          <ClipPathImage />
        </div>
      </div>

      {/* 滚动提示 */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 ${
        isTech ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <span className={`text-xs tracking-widest ${isTech ? 'font-["Space_Grotesk"]' : ''}`}>SCROLL</span>
        <div className={`w-px h-12 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse ${
          isTech ? '' : 'from-violet-500 to-transparent'
        }`} />
      </div>
    </section>
  );
}

// 文章卡片
function PostCard({ post, index }: { post: Post; index: number }) {
  const { theme } = useTheme();
  const isTech = theme === 'tech';

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block relative w-full max-w-sm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`relative p-6 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-500 ${
        isTech
          ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30 hover:shadow-xl'
      }`}>
        {/* 悬停时的光效 - 仅科技风 */}
        {isTech && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 245, 212, 0.06), transparent 40%)`,
            }}
          />
        )}

        {/* 序号装饰 */}
        <div className={`absolute -top-3 -left-3 w-12 h-12 flex items-center justify-center text-2xl font-bold ${
          isTech
            ? 'font-["Orbitron"] text-gray-800'
            : 'text-gray-200 dark:text-gray-700'
        }`}>
          {(index + 1).toString().padStart(2, '0')}
        </div>

        {/* 卡片内容 */}
        <div className="relative z-10">
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isTech
                    ? 'font-["Space_Grotesk"]'
                    : 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                }`}
                style={{
                  backgroundColor: isTech ? `${tag.color}20` : undefined,
                  color: isTech ? tag.color : undefined,
                }}
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
          <h3 className={`text-xl font-bold mb-3 line-clamp-2 transition-colors ${
            isTech
              ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
              : 'text-gray-900 dark:text-white group-hover:text-violet-600'
          }`}>
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {post.excerpt || '暂无简介'}
          </p>

          {/* 底部信息 */}
          <div className={`flex items-center justify-between text-xs ${
            isTech
              ? 'text-gray-600 font-["Space_Grotesk"]'
              : 'text-gray-500'
          }`}>
            <time>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</time>
            <span className={`flex items-center gap-1 transition-colors ${
              isTech ? 'group-hover:text-cyan-400' : 'group-hover:text-violet-600'
            }`}>
              阅读更多
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* 边框光效 */}
        {isTech ? (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-transparent to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-cyan-500/10 transition-all duration-500 pointer-events-none" />
        ) : (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/0 via-transparent to-violet-500/0 group-hover:from-violet-500/10 group-hover:to-violet-500/10 transition-all duration-500 pointer-events-none" />
        )}
      </div>
    </Link>
  );
}

// 最新文章区域
function LatestPosts({ posts }: { posts: Post[] }) {
  const { theme } = useTheme();
  const isTech = theme === 'tech';

  return (
    <section className="relative py-12 px-6">
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isTech ? 'from-transparent via-cyan-500/5 to-transparent' : 'from-transparent via-violet-500/5 to-transparent'
      }`} />

      <div className="relative max-w-5xl mx-auto">
        {/* 标题 - 居中布局 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-1 h-8 bg-gradient-to-b ${
              isTech ? 'from-cyan-400 to-emerald-400' : 'from-violet-500 to-blue-500'
            }`} />
            <h2 className={`text-3xl font-bold ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`}>最新文章</h2>
            <div className={`w-1 h-8 bg-gradient-to-b ${
              isTech ? 'from-emerald-400 to-cyan-400' : 'from-blue-500 to-violet-500'
            }`} />
          </div>
          <p className={`text-sm ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>Latest Posts</p>

          {/* 查看全部按钮 */}
          <div className="mt-4">
            <Link
              href="/posts"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm ${
                isTech
                  ? 'font-["Space_Grotesk"] border-gray-700 text-gray-300 hover:text-white hover:border-cyan-500/50'
                  : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-violet-500/50 dark:border-gray-700 dark:text-gray-400'
              }`}
            >
              查看全部
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 文章网格 - 居中 */}
        <div className="flex flex-wrap justify-center gap-6">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 系列卡片
function SeriesCard({ series, index }: { series: Series; index: number }) {
  const { theme } = useTheme();
  const isTech = theme === 'tech';

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
    <Link
      href={`/series/${series.slug}`}
      className="group relative block w-full max-w-xs"
    >
      <div className={`relative h-full p-6 rounded-2xl backdrop-blur-sm overflow-hidden transition-all duration-500 ${
        isTech
          ? 'bg-[#0a0a0f]/50 border border-gray-800/50 hover:border-cyan-500/30'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-500/30'
      }`}>
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* 内容 */}
        <div className="relative z-10">
          {/* 文章数徽章 */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4 ${
            isTech
              ? 'font-["Space_Grotesk"] bg-gray-800/50 text-gray-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {series.postCount} 篇文章
          </div>

          {/* 标题 */}
          <h3 className={`text-xl font-bold mb-2 transition-colors ${
            isTech
              ? 'font-["Space_Grotesk"] text-white group-hover:text-cyan-400'
              : 'text-gray-900 dark:text-white group-hover:text-violet-600'
          }`}>
            {series.name}
          </h3>

          {/* 描述 */}
          <p className={`text-sm line-clamp-2 leading-relaxed ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {series.description || '暂无描述'}
          </p>
        </div>

        {/* 序号装饰 */}
        <div className={`absolute -bottom-2 -right-2 w-16 h-16 text-6xl font-bold -z-10 transition-colors ${
          isTech
            ? 'font-["Orbitron"] text-gray-800/50 group-hover:text-cyan-500/10'
            : 'text-gray-200 dark:text-gray-700'
        }`}>
          {(index + 1).toString().padStart(2, '0')}
        </div>
      </div>
    </Link>
  );
}

// 专栏系列区域
function SeriesSection({ series }: { series: Series[] }) {
  const { theme } = useTheme();
  const isTech = theme === 'tech';

  return (
    <section className="relative py-12 px-6">
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isTech ? 'from-transparent via-cyan-500/5 to-transparent' : 'from-transparent via-violet-500/5 to-transparent'
      }`} />

      <div className="relative max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-1 h-8 bg-gradient-to-b ${
              isTech ? 'from-cyan-400 to-emerald-400' : 'from-violet-500 to-blue-500'
            }`} />
            <h2 className={`text-3xl font-bold ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`}>专栏系列</h2>
            <div className={`w-1 h-8 bg-gradient-to-b ${
              isTech ? 'from-emerald-400 to-cyan-400' : 'from-blue-500 to-violet-500'
            }`} />
          </div>
          <p className={`text-sm ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>Series Collection</p>
        </div>

        {/* 系列网格 - 居中 */}
        <div className="flex flex-wrap justify-center gap-6">
          {series.slice(0, 4).map((s, index) => (
            <SeriesCard key={s.id} series={s} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 标签云组件
function TagCloud({ tags }: { tags: Tag[] }) {
  const { theme } = useTheme();
  const isTech = theme === 'tech';

  const getTagSize = (count: number) => {
    if (count >= 10) return { fontSize: 'text-xl', padding: 'px-5 py-3', shadow: isTech ? 'shadow-lg shadow-cyan-500/20' : 'shadow-lg' };
    if (count >= 5) return { fontSize: 'text-lg', padding: 'px-4 py-2.5', shadow: isTech ? 'shadow-md shadow-cyan-500/10' : 'shadow-md' };
    return { fontSize: 'text-base', padding: 'px-4 py-2', shadow: 'shadow-sm' };
  };

  return (
    <section className="relative py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-1 h-8 bg-gradient-to-b ${
              isTech ? 'from-cyan-400 to-emerald-400' : 'from-violet-500 to-blue-500'
            }`} />
            <h2 className={`text-3xl font-bold ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`}>技术标签</h2>
            <div className={`w-1 h-8 bg-gradient-to-b ${
              isTech ? 'from-emerald-400 to-cyan-400' : 'from-blue-500 to-violet-500'
            }`} />
          </div>
          <p className={`text-sm ${
            isTech
              ? 'font-["Space_Grotesk"] text-gray-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>Explore by Topic</p>
        </div>

        {/* 标签云 */}
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
                <span
                  className={`font-medium transition-colors ${size.fontSize} ${
                    isTech
                      ? 'font-["Space_Grotesk"]'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  style={isTech ? { color: tag.color } : undefined}
                >
                  {tag.name}
                </span>
                <span className={`text-gray-600 dark:text-gray-500 ${size.fontSize} ${
                  isTech ? 'font-["JetBrains_Mono"]' : ''
                }`}>
                  {tag.postCount}
                </span>

                {/* 悬停光效 */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                     style={isTech ? { background: `radial-gradient(circle at center, ${tag.color}20, transparent 70%)` } : { background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 70%)' }} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 页脚
function Footer() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const isTech = theme === 'tech';

  return (
    <footer className={`relative py-16 px-6 border-t ${
      isTech
        ? 'border-gray-800/50'
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* 左侧 */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <div className={`absolute inset-0 bg-gradient-to-br rounded rotate-45 ${
                  isTech ? 'from-cyan-400 to-emerald-400' : 'from-violet-500 to-blue-500'
                }`} />
                <div className={`absolute inset-0 rounded-sm rotate-45 ${
                  isTech ? 'bg-[#030305]' : 'bg-white'
                }`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-bold text-xs ${
                    isTech ? 'text-cyan-400' : 'text-violet-600'
                  }`}>&lt;/&gt;</span>
                </div>
              </div>
              <span className={`text-lg font-bold ${
                isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
              }`}>{settings.siteName}</span>
            </div>
            <p className={`text-sm ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              用代码构建未来
            </p>
          </div>

          {/* 中间链接 */}
          <div className="flex items-center gap-8">
            {[
              { href: '/posts', label: '文章' },
              { href: '/series', label: '专栏' },
              { href: '/tags', label: '标签' },
              { href: '/about', label: '关于' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isTech
                    ? 'font-["Space_Grotesk"] text-gray-400 hover:text-cyan-400'
                    : 'text-gray-600 hover:text-violet-600 dark:text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 右侧版权 */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className={`text-sm ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              © 2026 Huwx.BLOG
            </p>
            <p className={`text-xs ${
              isTech
                ? 'font-["JetBrains_Mono"] text-gray-700'
                : 'text-gray-500 dark:text-gray-500 font-mono'
            }`}>
              Built with Next.js & Spring Boot
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==================== 主客户端组件 ====================
export function HomePageClient({ posts, series, tags }: HomePageClientProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
  }, []);

  // 防止 hydration 不匹配，挂载前不渲染
  if (!mounted) {
    return (
      <div className="min-h-screen font-sans bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${
      isTech
        ? 'bg-[#030305] text-white font-["Space_Grotesk"]'
        : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
    }`}>
      {/* 导航栏 */}
      <Navigation />

      {/* 主要内容 */}
      <main>
        <HeroSection />
        <LatestPosts posts={posts} />
        <SeriesSection series={series} />
        <TagCloud tags={tags} />
      </main>

      {/* 页脚 */}
      <Footer />

      {/* 全局样式 - 仅科技风 */}
      {isTech && (
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(5deg);
            }
          }

          * {
            scrollbar-width: thin;
            scrollbar-color: #1f2937 transparent;
          }

          *::-webkit-scrollbar {
            width: 8px;
          }

          *::-webkit-scrollbar-track {
            background: transparent;
          }

          *::-webkit-scrollbar-thumb {
            background: #1f2937;
            border-radius: 4px;
          }

          *::-webkit-scrollbar-thumb:hover {
            background: #374151;
          }
        `}</style>
      )}
    </div>
  );
}
