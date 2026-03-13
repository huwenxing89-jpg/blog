'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

interface MarkdownRendererProps {
  content: string;
}

// Tech 主题的代码块样式
const techTheme = {
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.5',
    borderRadius: 0,
    margin: 0,
    background: 'transparent',
    border: 'none',
    padding: 0,
  },
};

// Simple 主题的代码块样式
const simpleThemeDark = {
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.5',
    borderRadius: 0,
    margin: 0,
    background: 'transparent',
    border: 'none',
    padding: 0,
  },
};

const simpleThemeLight = {
  'code[class*="language-"]': {
    ...vs['code[class*="language-"]'],
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.5',
  },
  'pre[class*="language-"]': {
    ...vs['pre[class*="language-"]'],
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.5',
    borderRadius: 0,
    margin: 0,
    background: 'transparent',
    border: 'none',
    padding: 0,
  },
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { theme, systemTheme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isTech = theme === 'tech';
  const isDark = theme === 'dark' || (!theme && systemTheme === 'dark');

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const CodeBlock = ({ children, className, language }: any) => {
    const languageName = language || className?.replace(/language-/, '') || 'text';
    const codeString = String(children).replace(/\n$/, '');

    // 根据主题选择代码块样式
    let codeStyle = simpleThemeLight;
    if (isTech) {
      codeStyle = techTheme;
    } else if (isDark) {
      codeStyle = simpleThemeDark;
    } else {
      codeStyle = simpleThemeLight;
    }

    // 根据主题确定容器背景色
    const containerBg = isTech
      ? 'bg-[#0a0a0f]'
      : isDark
        ? 'bg-[#1e1e1e]'
        : 'bg-[#f5f5f5]';

    // 根据主题确定边框色
    const containerBorder = isTech
      ? 'border border-cyan-500/20'
      : isDark
        ? 'border border-[#3c3c3c]'
        : 'border border-[#e0e0e0]';

    // 悬停背景色
    const hoverBg = isTech
      ? 'hover:bg-[#0f0f18]'
      : isDark
        ? 'hover:bg-[#252526]'
        : 'hover:bg-[#ececec]';

    return (
      <div className={`group relative my-0 rounded-lg overflow-hidden transition-colors duration-200 ${containerBg} ${hoverBg}`}>
        {/* 代码块标题栏 */}
        <div className={`flex items-center justify-between px-4 py-2 text-sm ${
          isTech
            ? 'border-b border-cyan-500/20'
            : isDark
              ? 'border-b border-[#3c3c3c]'
              : 'border-b border-[#e0e0e0]'
        }`}>
          <span className={`flex items-center gap-2 font-medium ${
            isTech
              ? 'font-["Space_Grotesk"] text-cyan-400'
              : isDark
                ? 'text-[#cccccc]'
                : 'text-[#333333]'
          }`}>
            <span>{getLanguageIcon(languageName)}</span>
            <span>{getLanguageName(languageName)}</span>
          </span>
          <button
            onClick={() => copyToClipboard(codeString)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              copiedCode === codeString
                ? 'bg-green-500/20 text-green-500'
                : isTech
                  ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
                  : isDark
                    ? 'bg-[#3c3c3c] text-[#cccccc] hover:bg-[#4c4c4c] hover:text-white'
                    : 'bg-[#e0e0e0] text-[#666666] hover:bg-[#d0d0d0] hover:text-black'
            }`}
          >
            {copiedCode === codeString ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已复制
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                复制
              </>
            )}
          </button>
        </div>

        {/* 代码块内容 */}
        <div className={isTech ? 'bg-[#0a0a0f]' : (isDark ? 'bg-[#1e1e1e]' : 'bg-[#f5f5f5]')}>
          <SyntaxHighlighter
            language={languageName}
            style={codeStyle}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderTop: 'none',
              border: 'none',
              backgroundColor: 'transparent',
            }}
            showLineNumbers
            lineNumberStyle={{
              color: isTech ? '#00d4ff' : (isDark ? '#858585' : '#999999'),
              fontSize: '0.75rem',
              paddingRight: '1rem',
              minWidth: '2.5rem',
              userSelect: 'none',
            }}
            wrapLongLines
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 代码块
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match?.[1] || '';

          if (!inline && language) {
            return <CodeBlock className={className} language={language}>{children}</CodeBlock>;
          }

          // 行内代码
          return (
            <code
              className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                isTech
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'bg-primary/10 text-primary'
              }`}
              {...props}
            >
              {children}
            </code>
          );
        },

        // 标题 - 添加 id 以支持目录导航
        h1: ({ children, ...props }) => {
          const text = String(children);
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
          return (
            <h1 id={id} className={`text-3xl md:text-4xl font-bold mt-12 mb-6 scroll-mt-20 ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`} {...props}>
              {children}
            </h1>
          );
        },
        h2: ({ children, ...props }) => {
          const text = String(children);
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
          return (
            <h2 id={id} className={`text-2xl md:text-3xl font-bold mt-10 mb-5 scroll-mt-20 ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`} {...props}>
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const text = String(children);
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
          return (
            <h3 id={id} className={`text-xl md:text-2xl font-bold mt-8 mb-4 scroll-mt-20 ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`} {...props}>
              {children}
            </h3>
          );
        },
        h4: ({ children, ...props }) => {
          const text = String(children);
          const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
          return (
            <h4 id={id} className={`text-lg md:text-xl font-bold mt-6 mb-3 scroll-mt-20 ${
              isTech ? 'font-["Orbitron"] text-white' : 'text-gray-900 dark:text-white'
            }`} {...props}>
              {children}
            </h4>
          );
        },

        // 段落
        p: ({ children, ...props }) => (
          <p className={`my-4 leading-relaxed ${
            isTech ? 'font-["Space_Grotesk"] text-gray-300' : 'text-gray-700 dark:text-gray-300'
          }`} {...props}>
            {children}
          </p>
        ),

        // 链接
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            className={`hover:underline underline-offset-4 ${
              isTech
                ? 'font-["Space_Grotesk"] text-cyan-400 hover:text-cyan-300'
                : 'text-primary hover:text-primary/80'
            }`}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        ),

        // 列表
        ul: ({ children, ...props }) => (
          <ul className={`my-4 space-y-2 list-disc list-inside ${
            isTech ? 'font-["Space_Grotesk"] text-gray-300' : 'text-gray-700 dark:text-gray-300'
          }`} {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className={`my-4 space-y-2 list-decimal list-inside ${
            isTech ? 'font-["Space_Grotesk"] text-gray-300' : 'text-gray-700 dark:text-gray-300'
          }`} {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="ml-4" {...props}>
            {children}
          </li>
        ),

        // 引用块
        blockquote: ({ children, ...props }) => (
          <blockquote
            className={`my-6 pl-4 border-l-4 italic ${
              isTech
                ? 'border-cyan-500/50 text-cyan-300/80'
                : 'border-primary text-muted-foreground'
            }`}
            {...props}
          >
            {children}
          </blockquote>
        ),

        // 分隔线
        hr: (props) => (
          <hr className={`my-8 ${
            isTech
              ? 'border-cyan-500/20'
              : 'border-t border-border'
          }`} {...props} />
        ),

        // 表格
        table: ({ children, ...props }) => (
          <div className="my-6 overflow-x-auto">
            <table className={`min-w-full divide-y ${
              isTech
                ? 'divide-cyan-500/10'
                : 'divide-border'
            }`} {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className={`${
            isTech
              ? 'bg-cyan-500/5'
              : 'bg-muted'
          }`} {...props}>
            {children}
          </thead>
        ),
        tbody: ({ children, ...props }) => (
          <tbody className={`divide-y ${
            isTech
              ? 'divide-cyan-500/10'
              : 'divide-border'
          }`} {...props}>
            {children}
          </tbody>
        ),
        tr: ({ children, ...props }) => (
          <tr className={`${
            isTech
              ? 'hover:bg-cyan-500/5'
              : 'hover:bg-muted/50'
          }`} {...props}>
            {children}
          </tr>
        ),
        th: ({ children, ...props }) => (
          <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
            isTech
              ? 'font-["Space_Grotesk"] text-cyan-400'
              : ''
          }`} {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="px-4 py-3 text-sm" {...props}>
            {children}
          </td>
        ),

        // 图片
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt}
            className="my-6 rounded-lg shadow-lg"
            loading="lazy"
            {...props}
          />
        ),

        // 强调
        strong: ({ children, ...props }) => (
          <strong className={`font-bold ${
            isTech ? 'text-cyan-400' : ''
          }`} {...props}>
            {children}
          </strong>
        ),

        // 斜体
        em: ({ children, ...props }) => (
          <em className="italic" {...props}>
            {children}
          </em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// 获取语言显示名称
function getLanguageName(lang: string): string {
  const names: Record<string, string> = {
    js: 'JavaScript',
    ts: 'TypeScript',
    jsx: 'React JSX',
    tsx: 'React TSX',
    py: 'Python',
    java: 'Java',
    go: 'Go',
    rs: 'Rust',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    php: 'PHP',
    rb: 'Ruby',
    kt: 'Kotlin',
    swift: 'Swift',
    sh: 'Shell',
    bash: 'Bash',
    zsh: 'Zsh',
    ps: 'PowerShell',
    sql: 'SQL',
    yaml: 'YAML',
    yml: 'YAML',
    json: 'JSON',
    xml: 'XML',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    less: 'Less',
    md: 'Markdown',
    toml: 'TOML',
    dockerfile: 'Dockerfile',
    docker: 'Docker',
  };
  return names[lang] || lang.toUpperCase();
}

// 获取语言图标
function getLanguageIcon(lang: string): string {
  const icons: Record<string, string> = {
    js: '📜',
    ts: '📘',
    jsx: '⚛️',
    tsx: '⚛️',
    py: '🐍',
    java: '☕',
    go: '🐹',
    rs: '🦀',
    cpp: '⚡',
    c: '🔧',
    cs: '💜',
    php: '🐘',
    rb: '💎',
    kt: '🤖',
    swift: '🍎',
    sh: '💻',
    bash: '💻',
    sql: '🗃️',
    yaml: '⚙️',
    yml: '⚙️',
    json: '📋',
    xml: '📄',
    html: '🌐',
    css: '🎨',
    scss: '🎨',
    md: '📝',
    dockerfile: '🐳',
    docker: '🐳',
  };
  return icons[lang] || '📄';
}
