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
      .prepare("SELECT * FROM content_blocks ORDER BY key, locale")
      .all();
    return NextResponse.json({ blocks: results ?? [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

interface ContentBody {
  key?: string;
  locale?: string;
  value?: string;
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as ContentBody;
    const key = (body.key ?? "").trim();
    const locale = (body.locale ?? "en").trim();
    if (!key) {
      return NextResponse.json({ error: "Key required" }, { status: 400 });
    }
    const now = new Date().toISOString().replace("T", " ").slice(0, 19);
    const db = getDB();
    await db
      .prepare(
        `INSERT INTO content_blocks (key, locale, value, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(key, locale) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .bind(key, locale, body.value ?? "", now)
      .run();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
