'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// 用于 iframe 模式下同步路由到父窗口
export function IFrameRouteSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 只在 iframe 中运行
    if (window.parent !== window) {
      const fullPath = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

      window.parent.postMessage({
        type: 'SUB_APP_ROUTE_CHANGE',
        path: `/blog${fullPath}`
      }, '*');
    }
  }, [pathname, searchParams]);

  return null;
}
