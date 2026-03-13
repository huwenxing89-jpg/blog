import { TechHomePageClient } from './TechHomePageClient';

// ==================== 类型定义 ====================
interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
  tags: { id: number; name: string; slug: string; color: string }[];
  series: { id: number; name: string; slug: string } | null;
}

interface Series {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string | null;
  postCount: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

// ==================== 数据获取 ====================
async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  try {
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

    const posts = Array.isArray(postsData.data?.content) ? postsData.data.content :
                  Array.isArray(postsData.data) ? postsData.data : [];
    const series = Array.isArray(seriesData.data) ? seriesData.data : [];
    const tags = Array.isArray(tagsData.data) ? tagsData.data : [];

    return { posts, series, tags };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      posts: [],
      series: [],
      tags: [],
    };
  }
}

// ==================== 服务端页面 ====================
export default async function TechHomePage() {
  const { posts, series, tags } = await getData();

  return <TechHomePageClient posts={posts} series={series} tags={tags} />;
}
