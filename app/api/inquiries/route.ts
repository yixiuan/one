import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "edge";

interface InquiryBody {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InquiryBody;
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const db = getDB();
    const result = await db
      .prepare(
        "INSERT INTO inquiries (name, company, email, phone, message) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(
        name,
        (body.company ?? "").trim() || null,
        email,
        (body.phone ?? "").trim() || null,
        message
      )
      .run();

    return NextResponse.json({
      success: true,
      id: result.meta.last_row_id,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDB();
    const { results } = await db
      .prepare("SELECT * FROM inquiries ORDER BY created_at DESC")
      .all();
    return NextResponse.json({ inquiries: results ?? [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
