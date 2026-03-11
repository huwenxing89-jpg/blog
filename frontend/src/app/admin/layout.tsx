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

  if (!user || pathname === '/admin/login') {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
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
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t dark:border-gray-700">
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
