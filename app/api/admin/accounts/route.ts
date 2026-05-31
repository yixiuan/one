import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isAuthenticated, hashPassword, getCurrentUsername } from "@/lib/auth";

export const runtime = "edge";

interface CreateAccountBody {
  username?: string;
  password?: string;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = getDB();
    const { results } = await db
      .prepare(
        "SELECT id, username, created_at FROM admin_users ORDER BY id ASC"
      )
      .all();
    const currentUsername = await getCurrentUsername();
    return NextResponse.json({
      accounts: results ?? [],
      currentUsername,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as CreateAccountBody;
    const username = (body.username ?? "").trim();
    const password = body.password ?? "";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "用户名和密码不能为空" },
        { status: 400 }
      );
    }
    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: "用户名至少 3 个字符" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "密码至少 6 个字符" },
        { status: 400 }
      );
    }

    const db = getDB();
    const existing = await db
      .prepare("SELECT id FROM admin_users WHERE username = ? LIMIT 1")
      .bind(username)
      .first();
    if (existing) {
      return NextResponse.json(
        { success: false, error: "该用户名已存在" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const result = await db
      .prepare(
        "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)"
      )
      .bind(username, passwordHash)
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
