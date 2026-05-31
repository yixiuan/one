import { getRequestContext } from "@cloudflare/next-on-pages";

export interface Inquiry {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  is_read: number;
  created_at: string;
}

export interface Article {
  id: number;
  slug: string;
  locale: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: number;
  key: string;
  locale: string;
  value: string;
  updated_at: string;
}

export interface SeoMeta {
  id: number;
  path: string;
  locale: string;
  title: string;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export function getDB(): D1Database {
  const ctx = getRequestContext();
  return ctx.env.DB as D1Database;
}
