import { NextRequest, NextResponse } from "next/server";
import { getDB, type Article } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "edge";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDB();
    const article = await db
      .prepare("SELECT * FROM articles WHERE id = ? LIMIT 1")
      .bind(params.id)
      .first<Article>();
    if (!article) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ article });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ArticleBody;
    const db = getDB();
    const existing = await db
      .prepare("SELECT * FROM articles WHERE id = ? LIMIT 1")
      .bind(params.id)
      .first<Article>();
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const status = body.status === "published" ? "published" : "draft";
    let publishedAt = existing.published_at;
    if (status === "published" && !existing.published_at) {
      publishedAt = new Date().toISOString().replace("T", " ").slice(0, 19);
    }
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);

    await db
      .prepare(
        `UPDATE articles SET slug = ?, locale = ?, title = ?, excerpt = ?, content = ?, cover_image = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?`
      )
      .bind(
        (body.slug ?? existing.slug).trim(),
        body.locale ?? existing.locale,
        (body.title ?? existing.title).trim(),
        (body.excerpt ?? "").trim() || null,
        (body.content ?? existing.content).trim(),
        (body.coverImage ?? "").trim() || null,
        status,
        publishedAt,
        now,
        params.id
      )
      .run();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDB();
    await db.prepare("DELETE FROM articles WHERE id = ?").bind(params.id).run();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
