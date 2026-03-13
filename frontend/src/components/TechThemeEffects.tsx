'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * 科技风主题特效组件
 * 只在科技风主题下显示，包含：
 * - 鼠标跟随光晕
 * - 扫描线背景
 */
export function TechThemeEffects() {
  const { theme } = useTheme();
  const [isTech, setIsTech] = useState(false);

  useEffect(() => {
    setIsTech(theme === 'tech');
  }, [theme]);

  if (!isTech) {
    return null;
  }

  return (
    <>
      <MouseGlow />
      <ScanlineBackground />
    </>
  );
}

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
        background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(0, 245, 212, 0.15), rgba(0, 180, 255, 0.08) 30%, transparent 50%)`,
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
