import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "edge";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") ?? "en";
    const all = searchParams.get("all") === "1";
    const db = getDB();

    if (all) {
      if (!(await isAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { results } = await db
        .prepare("SELECT * FROM articles ORDER BY created_at DESC")
        .all();
      return NextResponse.json({ articles: results ?? [] });
    }

    const { results } = await db
      .prepare(
        "SELECT * FROM articles WHERE status = 'published' AND locale = ? ORDER BY published_at DESC"
      )
      .bind(locale)
      .all();
    return NextResponse.json({ articles: results ?? [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

interface ArticleBody {
  slug?: string;
  locale?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ArticleBody;
    const title = (body.title ?? "").trim();
    const content = (body.content ?? "").trim();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }
    const slug = (body.slug ?? "").trim() || slugify(title);
    const locale = body.locale ?? "en";
    const status = body.status === "published" ? "published" : "draft";
    const publishedAt =
      status === "published" ? new Date().toISOString().replace("T", " ").slice(0, 19) : null;

    const db = getDB();
    const result = await db
      .prepare(
        `INSERT INTO articles (slug, locale, title, excerpt, content, cover_image, status, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        slug,
        locale,
        title,
        (body.excerpt ?? "").trim() || null,
        content,
        (body.coverImage ?? "").trim() || null,
        status,
        publishedAt
      )
      .run();

    return NextResponse.json({ success: true, id: result.meta.last_row_id });
  } catch {
    return NextResponse.json(
      { error: "Server error or duplicate slug" },
      { status: 500 }
    );
  }
}
