import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDB();
    const totalInquiries = await db
      .prepare("SELECT COUNT(*) as c FROM inquiries")
      .first<{ c: number }>();
    const unreadInquiries = await db
      .prepare("SELECT COUNT(*) as c FROM inquiries WHERE is_read = 0")
      .first<{ c: number }>();
    const totalArticles = await db
      .prepare("SELECT COUNT(*) as c FROM articles")
      .first<{ c: number }>();
    const publishedArticles = await db
      .prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'published'")
      .first<{ c: number }>();

    return NextResponse.json({
      totalInquiries: totalInquiries?.c ?? 0,
      unreadInquiries: unreadInquiries?.c ?? 0,
      totalArticles: totalArticles?.c ?? 0,
      publishedArticles: publishedArticles?.c ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
