'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useSettings } from '@/components/providers/settings-provider';

export function Footer() {
  const currentYear = new Date().getFullYear();
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
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <div className={`absolute inset-0 rounded rotate-45 ${
                  isTech
                    ? 'bg-gradient-to-br from-cyan-400 to-emerald-400'
                    : 'bg-gradient-to-br from-violet-500 to-blue-500'
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
                isTech
                  ? 'font-["Orbitron"] text-white'
                  : 'text-gray-900 dark:text-white'
              }`}>{settings.siteName}</span>
            </Link>
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
              © {currentYear} {settings.siteName}
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

        {/* 备案号 */}
        <div className="mt-8 pt-8 border-t border-gray-800/30 text-center">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm transition-colors ${
              isTech
                ? 'font-["Space_Grotesk"] text-gray-600 hover:text-cyan-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300'
            }`}
          >
            湘ICP备2025109709号-2
          </a>
        </div>
      </div>
    </footer>
  );
}
