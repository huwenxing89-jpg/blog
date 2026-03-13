import { Post, Series, Tag } from '@/types';

// ==================== 数据获取 ====================
async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088/api';

  const [postsRes, seriesRes, tagsRes] = await Promise.all([
    fetch(`${apiUrl}/posts?page=1&size=5`, { cache: 'no-store' }),
    fetch(`${apiUrl}/series`, { cache: 'no-store' }),
    fetch(`${apiUrl}/tags`, { cache: 'no-store' }),
  ]);

  const [postsData, seriesData, tagsData] = await Promise.all([
    postsRes.json(),
    seriesRes.json(),
    tagsRes.json(),
  ]);

  return {
    posts: postsData.data?.content || postsData.data || [],
    series: seriesData.data || [],
    tags: tagsData.data || [],
  };
}

// ==================== 主页面 (服务端组件) ====================
export default async function TechHomePage() {
  const { posts, series, tags } = await getData();

  // 动态导入客户端组件
  const TechHomeClient = (await import('./page-tech-client')).default;

  return <TechHomeClient posts={posts} series={series} tags={tags} />;
}
