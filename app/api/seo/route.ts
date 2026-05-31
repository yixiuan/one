import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDB();
    const { results } = await db
      .prepare("SELECT * FROM seo_meta ORDER BY path, locale")
      .all();
    return NextResponse.json({ seo: results ?? [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

interface SeoBody {
  path?: string;
  locale?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as SeoBody;
    const path = (body.path ?? "").trim();
    const locale = (body.locale ?? "en").trim();
    const title = (body.title ?? "").trim();
    if (!path || !title) {
      return NextResponse.json(
        { error: "Path and title required" },
        { status: 400 }
      );
    }

    const db = getDB();
    await db
      .prepare(
        `INSERT INTO seo_meta (path, locale, title, description, keywords, og_image)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(path, locale) DO UPDATE SET
           title = excluded.title,
           description = excluded.description,
           keywords = excluded.keywords,
           og_image = excluded.og_image`
      )
      .bind(
        path,
        locale,
        title,
        (body.description ?? "").trim() || null,
        (body.keywords ?? "").trim() || null,
        (body.ogImage ?? "").trim() || null
      )
      .run();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
