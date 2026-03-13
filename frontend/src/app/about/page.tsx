'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSettings } from '@/components/providers/settings-provider';

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

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isTech = mounted && theme === 'tech';

  useEffect(() => {
    setMounted(true);
  }, []);

  // 防止 hydration 不匹配，挂载前不渲染
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className={`text-sm font-medium ${
                isTech
                  ? 'font-["Space_Grotesk"] text-cyan-400'
                  : 'text-violet-700 dark:text-violet-300'
              }`}>About</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${
              isTech ? 'font-["Orbitron"]' : ''
            }`}>
              <span className={isTech ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400' : 'gradient-text'}>
                关于我
              </span>
            </h1>

            <p className={`text-lg max-w-2xl mx-auto ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              热爱技术，乐于分享，记录学习路上的点点滴滴
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <p className={`text-xl leading-relaxed text-center mb-16 ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              欢迎来到我的技术博客！这里记录了我在编程学习和工作过程中的思考与总结。
            </p>

            <div className="space-y-16">
              {/* 技术栈 */}
              <section className={`p-8 rounded-2xl ${
                isTech
                  ? 'bg-[#0a0a0f]/50 border border-gray-800/50'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    isTech
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-bold ${
                    isTech
                      ? 'font-["Orbitron"] text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}>技术栈</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: '前端', tech: 'React、Next.js、TypeScript、Tailwind CSS', icon: '💻' },
                    { name: '后端', tech: 'Spring Boot、MyBatis Plus、MySQL', icon: '⚙️' },
                    { name: '工具', tech: 'Git、Docker、VS Code', icon: '🔧' },
                  ].map((item) => (
                    <div key={item.name} className={`p-6 rounded-xl ${
                      isTech
                        ? 'bg-gray-800/30 border border-gray-700/50'
                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}>
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h3 className={`font-bold mb-2 ${
                        isTech ? 'font-["Space_Grotesk"] text-white' : 'text-gray-900 dark:text-white'
                      }`}>{item.name}</h3>
                      <p className={`text-sm ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-gray-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>{item.tech}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 联系方式 */}
              <section className={`p-8 rounded-2xl ${
                isTech
                  ? 'bg-[#0a0a0f]/50 border border-gray-800/50'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    isTech
                      ? 'bg-pink-500/20 text-pink-400'
                      : 'bg-pink-500/20 text-pink-600 dark:text-pink-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-bold ${
                    isTech
                      ? 'font-["Orbitron"] text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}>联系方式</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="mailto:your-email@example.com" className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isTech
                      ? 'bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-violet-500/30'
                  }`}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                      isTech
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                    }`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className={`font-bold mb-1 ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}>Email</div>
                      <div className={`text-sm ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-gray-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>your-email@example.com</div>
                    </div>
                  </a>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isTech
                      ? 'bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-violet-500/30'
                  }`}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                      isTech
                        ? 'bg-gray-500/20 text-gray-400'
                        : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                    }`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.066 0 2.78-.468 2.78-1.064 0-.467.35-1.064.727-1.028-.253-.446-.064-1.332.064-1.065-2.502 0-.826.84-1.246 1.124-1.246 1.41 0 2.124.069 2.124.069 0 .469-.047.809-.12 1.032-.064.727.35-1.027.464-1.754 0-2.247-1.246-1.246-1.246 0-1.994 0-2-2.924-1-3.542-1.032.746-1.032 1.727 0 1.632.064.276 1.064.277.064 1.415 0 2.828.015 1.31 0 2.747 1.026 2.747 1.026 1.543-.94 3.31-.826 2.37a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 01-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-1.066 2.573c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 01-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 01-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 002.573-1.066c1.756.426 2.924 1.756 3.35 0a1.724 1.724 0 012.573 1.066c.996.608 2.296.07 2.572-1.065z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className={`font-bold mb-1 ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-white'
                          : 'text-gray-900 dark:text-white'
                      }`}>GitHub</div>
                      <div className={`text-sm ${
                        isTech
                          ? 'font-["Space_Grotesk"] text-gray-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>github.com/yourusername</div>
                    </div>
                  </a>
                </div>
              </section>

              {/* 关于博客 */}
              <section className={`p-8 rounded-2xl ${
                isTech
                  ? 'bg-[#0a0a0f]/50 border border-gray-800/50'
                  : 'bg-gradient-to-br from-violet-500/10 via-blue-500/10 to-cyan-500/10 border border-violet-500/20'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    isTech
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className={`text-2xl font-bold ${
                    isTech
                      ? 'font-["Orbitron"] text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}>关于博客</h2>
                </div>
                <p className={`leading-relaxed mb-4 ${
                  isTech
                    ? 'font-["Space_Grotesk"] text-gray-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  本博客使用 Next.js 15 + Spring Boot 构建，旨在分享技术知识和学习心得。
                </p>
                <p className={`leading-relaxed ${
                  isTech
                    ? 'font-["Space_Grotesk"] text-gray-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  如果你对我的任何文章有疑问或建议，欢迎与我交流！
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isTech
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}>Next.js 15</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isTech
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  }`}>Spring Boot</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isTech
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                  }`}>TypeScript</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    isTech
                      ? 'bg-violet-500/20 text-violet-400'
                      : 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                  }`}>Tailwind CSS</span>
                </div>
              </section>
            </div>
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
