'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function QiankunBridge() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 1. 初始化时接收来自主应用 URL 的状态并持久化
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const token = url.searchParams.get('token')
      const locale = url.searchParams.get('locale')
      if (token) localStorage.setItem('token', token)
      if (locale) localStorage.setItem('locale', locale)
    } catch {}
  }, [])

  // 2. 监听 Next.js 路由变化，并向父窗口(乾坤主应用)发送消息
  useEffect(() => {
    try {
      // 判断是否在 iframe 中运行
      if (window !== window.top) {
        // 将当前的路径发给父窗口
        // 例如 pathname 是 /posts/1
        window.parent.postMessage({
          type: 'ROUTER_CHANGE',
          path: pathname,
          search: searchParams.toString()
        }, '*') // 在实际生产环境中，'*' 应该替换为主应用的真实域名
      }
    } catch {}
  }, [pathname, searchParams])

  return null
}
