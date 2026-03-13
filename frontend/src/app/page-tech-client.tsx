'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, Series, Tag } from '@/types';

// ==================== 主客户端组件 ====================
export default function TechHomeClient({
  posts,
  series,
  tags,
}: {
  posts: Post[];
  series: Series[];
  tags: Tag[];
}) {
  return (
    <div className="min-h-screen bg-[#030305] text-white font-['Space_Grotesk']">
      {/* 全局效果 */}
      <MouseGlow />
      <ScanlineBackground />

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

      {/* 全局样式 */}
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
    </div>
  );
}

// ==================== 组件 ====================

// 鼠标跟随光晕组件
function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 245, 212, 0.08), transparent 40%)`,
      }}
    />
  );
}

// 扫描线背景
function ScanlineBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,212,0.03)_1px,transparent_1px)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,245,212,0.03)_1px,transparent_1px)] bg-[length:4px_100%]" />
    </div>
  );
}

// 导航栏
function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#030305]/80 backdrop-blur-xl border-b border-cyan-500/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#030305] rounded-md rotate-45" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-lg">&lt;/&gt;</span>
              </div>
            </div>
          </div>
          <span className="font-['Orbitron'] text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
            DEV.LOG
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
              className="relative font-['Space_Grotesk'] text-sm text-gray-400 hover:text-white transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* GitHub 链接 */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 transition-all group"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="font-['Space_Grotesk'] text-sm">GitHub</span>
        </a>
      </div>
    </nav>
  );
}

// Hero 区域
function HeroSection() {
  const [displayText, setDisplayText] = useState('');
  const fullText = '构建未来的数字体验';
  const [cursorVisible, setCursorVisible] = useState(true);

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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 背景渐变网格 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,245,212,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(255,0,110,0.1),transparent)]" />

      {/* 浮动几何图形 */}
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

      {/* 内容 */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* 标签 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-['Space_Grotesk'] text-sm text-cyan-400">
            全栈开发 · 技术分享 · 架构设计
          </span>
        </div>

        {/* 主标题 */}
        <h1 className="font-['Orbitron'] text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          <span className="inline-block hover:text-cyan-400 transition-colors cursor-default">代码</span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400">
            {" "}创造世界
          </span>
        </h1>

        {/* 打字机副标题 */}
        <div className="font-['Space_Grotesk'] text-2xl md:text-3xl text-gray-400 mb-12 h-10">
          <span className="text-white">{displayText}</span>
          <span
            className={`inline-block w-0.5 h-8 bg-cyan-400 ml-1 align-middle ${
              cursorVisible ? 'opacity-100' : 'opacity-0'
            } transition-opacity`}
          />
        </div>

        {/* 描述 */}
        <p className="font-['Space_Grotesk'] text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          专注于前后端技术、架构设计与工程实践。在这里分享代码、思考与成长。
        </p>

        {/* CTA 按钮组 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/posts"
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-['Space_Grotesk'] font-semibold text-white overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              浏览文章
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/about"
            className="group px-8 py-4 border border-gray-700 rounded-lg font-['Space_Grotesk'] font-semibold text-gray-300 hover:border-cyan-500/50 hover:text-white transition-all hover:scale-105"
          >
            关于我
          </Link>
        </div>

        {/* 装饰代码片段 */}
        <div className="mt-20 p-6 rounded-xl bg-[#0a0a0f] border border-gray-800/50 max-w-xl mx-auto font-['JetBrains_Mono'] text-sm text-left overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <pre className="text-gray-500">
            <span className="text-purple-400">const</span> <span className="text-cyan-400">developer</span> = {'{'}
            <br />
            &nbsp;&nbsp;<span className="text-emerald-400">passion</span>: <span className="text-orange-400">&apos;无限&apos;</span>,
            <br />
            &nbsp;&nbsp;<span className="text-emerald-400">skills</span>: [<span className="text-orange-400">&apos;React&apos;</span>, <span className="text-orange-400">&apos;Node&apos;</span>, <span className="text-orange-400">&apos;Rust&apos;</span>],
            <br />
            &nbsp;&nbsp;<span className="text-emerald-400">learning</span>: <span className="text-purple-400">true</span>
            <br />
            {'}'};
          </pre>
        </div>
      </div>

      {/* 滚动提示 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="font-['Space_Grotesk'] text-xs tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

// 文章卡片
function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block relative"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative p-6 rounded-2xl bg-[#0a0a0f]/50 border border-gray-800/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">
        {/* 序号装饰 */}
        <div className="absolute -top-3 -left-3 w-12 h-12 flex items-center justify-center font-['Orbitron'] text-2xl font-bold text-gray-800">
          {(index + 1).toString().padStart(2, '0')}
        </div>

        {/* 卡片内容 */}
        <div className="relative z-10">
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-xs font-['Space_Grotesk'] font-medium"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {post.series && (
              <span className="px-3 py-1 rounded-full text-xs font-['Space_Grotesk'] font-medium bg-purple-500/20 text-purple-400">
                {post.series.name}
              </span>
            )}
          </div>

          {/* 标题 */}
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className="font-['Space_Grotesk'] text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt || '暂无简介'}
          </p>

          {/* 底部信息 */}
          <div className="flex items-center justify-between text-xs text-gray-600 font-['Space_Grotesk']">
            <time>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</time>
            <span className="flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
              阅读更多
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// 最新文章区域
function LatestPosts({ posts }: { posts: Post[] }) {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400" />
              <h2 className="font-['Orbitron'] text-3xl font-bold text-white">最新文章</h2>
            </div>
            <p className="font-['Space_Grotesk'] text-gray-500 ml-4">Latest Posts</p>
          </div>
          <Link
            href="/posts"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-cyan-500/30 transition-all font-['Space_Grotesk'] text-sm"
          >
            查看全部
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 文章网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const getGradient = (i: number) => {
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
      href={`/series/${series.slug}`}
      className="group relative block"
    >
      <div className="relative h-full p-6 rounded-2xl bg-[#0a0a0f]/50 border border-gray-800/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-cyan-500/30">
        {/* 背景渐变 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* 内容 */}
        <div className="relative z-10">
          {/* 文章数徽章 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 text-xs font-['Space_Grotesk'] text-gray-400 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {series.postCount} 篇文章
          </div>

          {/* 标题 */}
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {series.name}
          </h3>

          {/* 描述 */}
          <p className="font-['Space_Grotesk'] text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {series.description || '暂无描述'}
          </p>
        </div>

        {/* 序号装饰 */}
        <div className="absolute -bottom-2 -right-2 w-16 h-16 font-['Orbitron'] text-6xl font-bold text-gray-800/50 -z-10 group-hover:text-cyan-500/10 transition-colors">
          {(index + 1).toString().padStart(2, '0')}
        </div>
      </div>
    </Link>
  );
}

// 专栏系列区域
function SeriesSection({ series }: { series: Series[] }) {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400" />
            <h2 className="font-['Orbitron'] text-3xl font-bold text-white">专栏系列</h2>
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400" />
          </div>
          <p className="font-['Space_Grotesk'] text-gray-500">Series Collection</p>
        </div>

        {/* 系列网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
  const getTagSize = (count: number) => {
    if (count >= 10) return { fontSize: 'text-xl', padding: 'px-5 py-3', shadow: 'shadow-lg shadow-cyan-500/20' };
    if (count >= 5) return { fontSize: 'text-lg', padding: 'px-4 py-2.5', shadow: 'shadow-md shadow-cyan-500/10' };
    return { fontSize: 'text-base', padding: 'px-4 py-2', shadow: 'shadow-sm' };
  };

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-emerald-400" />
            <h2 className="font-['Orbitron'] text-3xl font-bold text-white">技术标签</h2>
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400" />
          </div>
          <p className="font-['Space_Grotesk'] text-gray-500">Explore by Topic</p>
        </div>

        {/* 标签云 */}
        <div className="flex flex-wrap justify-center gap-4">
          {tags.map((tag) => {
            const size = getTagSize(tag.postCount);
            return (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className={`group relative inline-flex items-center gap-2 rounded-xl bg-[#0a0a0f] border border-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-cyan-500/50 ${size.padding} ${size.shadow}`}
              >
                <span
                  className={`font-['Space_Grotesk'] font-medium transition-colors ${size.fontSize}`}
                  style={{ color: tag.color }}
                >
                  {tag.name}
                </span>
                <span className={`font-['JetBrains_Mono'] text-gray-600 ${size.fontSize}`}>
                  {tag.postCount}
                </span>

                {/* 悬停光效 */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                     style={{ background: `radial-gradient(circle at center, ${tag.color}20, transparent 70%)` }} />
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
  return (
    <footer className="relative py-16 px-6 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* 左侧 */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded rotate-45" />
                <div className="absolute inset-0 bg-[#030305] rounded-sm rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-xs">&lt;/&gt;</span>
                </div>
              </div>
              <span className="font-['Orbitron'] text-lg font-bold text-white">DEV.LOG</span>
            </div>
            <p className="font-['Space_Grotesk'] text-sm text-gray-600">
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
                className="font-['Space_Grotesk'] text-sm text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* 右侧版权 */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="font-['Space_Grotesk'] text-sm text-gray-600">
              © 2024 Dev.Log
            </p>
            <p className="font-['JetBrains_Mono'] text-xs text-gray-700">
              Built with Next.js &amp; Spring Boot
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
