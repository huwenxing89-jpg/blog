import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeEffectsWrapper } from '@/components/ThemeEffectsWrapper';

export const metadata: Metadata = {
  title: '我的技术博客',
  description: '一个专注于技术分享的博客',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="simple"
          enableSystem={false}
          disableTransitionOnChange
          themes={['simple', 'tech']}
        >
          <ThemeEffectsWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
