import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 处理图片 URL，将 localhost:8088 替换为相对路径
 * 这样可以通过 Next.js rewrite 规则代理到后端
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // 如果是完整的 localhost URL，转换为相对路径
  if (url.includes('localhost:8088')) {
    return url.replace(/http:\/\/localhost:8088/, '');
  }

  return url;
}
