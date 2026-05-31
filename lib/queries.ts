import { getDB, type Article, type SeoMeta } from "./db";
import type { Locale } from "@/i18n/config";

export async function getSeoMeta(
  path: string,
  locale: Locale
): Promise<SeoMeta | null> {
  try {
    const db = getDB();
    const row = await db
      .prepare("SELECT * FROM seo_meta WHERE path = ? AND locale = ? LIMIT 1")
      .bind(path, locale)
      .first<SeoMeta>();
    if (row) return row;
    const fallback = await db
      .prepare("SELECT * FROM seo_meta WHERE path = ? AND locale = 'en' LIMIT 1")
      .bind(path)
      .first<SeoMeta>();
    return fallback ?? null;
  } catch {
    return null;
  }
}

export async function getPublishedArticles(
  locale: Locale,
  limit = 20,
  offset = 0
): Promise<Article[]> {
  try {
    const db = getDB();
    const { results } = await db
      .prepare(
        "SELECT * FROM articles WHERE status = 'published' AND locale = ? ORDER BY published_at DESC LIMIT ? OFFSET ?"
      )
      .bind(locale, limit, offset)
      .all<Article>();
    return results ?? [];
  } catch {
    return [];
  }
}

export async function getArticleBySlug(
  slug: string,
  locale: Locale
): Promise<Article | null> {
  try {
    const db = getDB();
    const row = await db
      .prepare(
        "SELECT * FROM articles WHERE slug = ? AND locale = ? AND status = 'published' LIMIT 1"
      )
      .bind(slug, locale)
      .first<Article>();
    return row ?? null;
  } catch {
    return null;
  }
}
