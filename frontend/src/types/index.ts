// ==================== 类型定义 ====================

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string | null;
  createdAt: string;
  tags: { id: number; name: string; slug: string; color: string }[];
  series: { id: number; name: string; slug: string } | null;
}

export interface Series {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string | null;
  postCount: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  postCount: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
  postId: number;
}
