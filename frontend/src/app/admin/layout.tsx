'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

const navItems = [
  { href: '/admin/dashboard', label: '仪表盘', icon: '📊' },
  { href: '/admin/posts', label: '文章', icon: '📝' },
  { href: '/admin/categories', label: '分类', icon: '📁' },
  { href: '/admin/series', label: '系列', icon: '📚' },
  { href: '/admin/tags', label: '标签', icon: '🏷️' },
  { href: '/admin/settings', label: '设置', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 强制移除科技风主题的 body 样式
  useEffect(() => {
    // 给 body 添加特殊 class 标识管理端
    document.body.classList.add('admin-mode');
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, Inter, Noto Sans SC, system-ui, sans-serif';
    // 使用 !important 强制覆盖 - 始终使用浅色背景
    document.body.style.setProperty('background', '#ffffff', 'important');
    document.body.style.setProperty('color', '#1f2937', 'important');

    return () => {
      document.body.classList.remove('admin-mode');
      document.body.style.fontFamily = '';
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('color');
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex admin-page" style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, Inter, Noto Sans SC, system-ui, sans-serif',
      backgroundColor: '#ffffff'
    }}>
      <aside className="w-64 bg-gray-50 border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">博客管理</h1>
        </div>
        
        <nav className="p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 px-4 rounded-md mb-1 ${
                pathname === item.href
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              退出
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
