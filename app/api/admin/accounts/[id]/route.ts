import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import {
  isAuthenticated,
  hashPassword,
  getCurrentUsername,
} from "@/lib/auth";

export const runtime = "edge";

interface UpdateBody {
  password?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as UpdateBody;
    const password = body.password ?? "";
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "密码至少 6 个字符" },
        { status: 400 }
      );
    }

    const db = getDB();
    const passwordHash = await hashPassword(password);
    const result = await db
      .prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?")
      .bind(passwordHash, params.id)
      .run();

    if (!result.meta.changes) {
      return NextResponse.json(
        { success: false, error: "账号不存在" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
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

    const target = await db
      .prepare("SELECT username FROM admin_users WHERE id = ? LIMIT 1")
      .bind(params.id)
      .first<{ username: string }>();
    if (!target) {
      return NextResponse.json(
        { success: false, error: "账号不存在" },
        { status: 404 }
      );
    }

    const currentUsername = await getCurrentUsername();
    if (currentUsername && currentUsername === target.username) {
      return NextResponse.json(
        { success: false, error: "不能删除当前登录的账号" },
        { status: 400 }
      );
    }

    const countRow = await db
      .prepare("SELECT COUNT(*) as total FROM admin_users")
      .first<{ total: number }>();
    if ((countRow?.total ?? 0) <= 1) {
      return NextResponse.json(
        { success: false, error: "必须保留至少一个管理员账号" },
        { status: 400 }
      );
    }

    await db
      .prepare("DELETE FROM admin_users WHERE id = ?")
      .bind(params.id)
      .run();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
