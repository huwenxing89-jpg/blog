'use client';

import { usePathname } from 'next/navigation';
import { TechThemeEffects } from './TechThemeEffects';

/**
 * 主题特效包装器
 * 只在非管理页面显示科技风特效
 */
export function ThemeEffectsWrapper() {
  const pathname = usePathname();

  // 管理页面不显示科技风特效
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return <TechThemeEffects />;
}
