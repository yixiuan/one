import { getDB, type Article } from "@/lib/db";
import { siteConfig } from "@/lib/seo";
import { locales } from "@/i18n/config";

export const runtime = "edge";

const staticPaths = ["", "/about", "/services", "/why-us", "/news", "/contact"];

export async function GET() {
  const urls: string[] = [];
  const now = new Date().toISOString();

  for (const locale of locales) {
    for (const path of staticPaths) {
      urls.push(`
  <url>
    <loc>${siteConfig.url}/${locale}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`);
    }
  }

  try {
    const db = getDB();
    const { results } = await db
      .prepare(
        "SELECT slug, locale, updated_at FROM articles WHERE status = 'published'"
      )
      .all<Pick<Article, "slug" | "locale" | "updated_at">>();
    for (const a of results ?? []) {
      urls.push(`
  <url>
    <loc>${siteConfig.url}/${a.locale}/news/${a.slug}</loc>
    <lastmod>${new Date(a.updated_at.replace(" ", "T")).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    }
  } catch {
    // D1 unavailable during build — skip dynamic entries
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
