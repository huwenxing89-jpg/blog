'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

// 图片 clip-path 悬停效果组件 - 鼠标移动时揭示底层图片
export function ClipPathImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const { theme } = useTheme();
  const isTech = theme === 'tech';

  // 使用 useCallback 和 requestAnimationFrame 优化性能
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!rectRef.current || !topLayerRef.current) return;

    const rect = rectRef.current;
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    // 直接设置，不使用 transition，避免卡顿
    topLayerRef.current.style.clipPath = `polygon(
      0 100%,
      0 0,
      100% 0,
      ${xPercent * 2}% ${yPercent * 0}%,
      0 ${yPercent * 2}%
    )`;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 缓存 rect，只在需要时更新
    const updateRect = () => {
      rectRef.current = container.getBoundingClientRect();
    };

    updateRect();

    // 使用 passive 事件监听器提高性能
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-48 rounded-xl overflow-hidden cursor-crosshair"
    >
      {/* 底层图片 */}
      <Image
        src="/assets/app_white2.png"
        alt="Light Theme"
        fill
        className="object-cover"
        priority
      />
      {/* 顶层图片 - 带 clip-path */}
      <div
        ref={topLayerRef}
        className="absolute inset-0 z-10"
        style={{
          clipPath: 'polygon(0 100%, 0 0, 100% 0, 100% 0%, 0 100%)'
        }}
      >
        <Image
          src="/assets/blacked2DCjThr.png"
          alt="Dark Theme"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
