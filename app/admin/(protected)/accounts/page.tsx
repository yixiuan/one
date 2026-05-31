"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  KeyRound,
  Trash2,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

export const runtime = "edge";

interface Account {
  id: number;
  username: string;
  created_at: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);

  const [pwdTarget, setPwdTarget] = useState<Account | null>(null);
  const [pwdValue, setPwdValue] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/accounts");
    if (res.ok) {
      const data = (await res.json()) as {
        accounts: Account[];
        currentUsername: string | null;
      };
      setAccounts(data.accounts);
      setCurrentUsername(data.currentUsername);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);
    const res = await fetch("/api/admin/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername, password: newPassword }),
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    setCreating(false);
    if (res.ok && data.success) {
      setNewUsername("");
      setNewPassword("");
      flash("管理员账号创建成功");
      load();
    } else {
      setError(data.error ?? "创建失败");
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdTarget) return;
    setError("");
    setSavingPwd(true);
    const res = await fetch(`/api/admin/accounts/${pwdTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwdValue }),
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    setSavingPwd(false);
    if (res.ok && data.success) {
      setPwdTarget(null);
      setPwdValue("");
      flash("密码修改成功");
    } else {
      setError(data.error ?? "修改失败");
    }
  };

  const removeAccount = async (acc: Account) => {
    if (!confirm(`确定删除管理员「${acc.username}」吗？`)) return;
    const res = await fetch(`/api/admin/accounts/${acc.id}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    if (res.ok && data.success) {
      flash("账号已删除");
      load();
    } else {
      alert(data.error ?? "删除失败");
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber">
          <Users className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">
            账号管理
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            管理后台管理员账号，支持新增、修改密码与删除。
          </p>
        </div>
      </div>

      {notice && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {notice}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-navy/5 bg-white">
            <div className="border-b border-navy/5 px-6 py-4">
              <h2 className="font-display text-base font-bold text-navy">
                管理员列表
              </h2>
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-7 w-7 animate-spin text-amber" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="px-6 py-12 text-center text-ink/50">
                暂无管理员账号
              </div>
            ) : (
              <ul className="divide-y divide-navy/5">
                {accounts.map((acc) => {
                  const isSelf = acc.username === currentUsername;
                  return (
                    <li
                      key={acc.id}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 font-semibold uppercase text-navy">
                          {acc.username.charAt(0)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-navy">
                              {acc.username}
                            </span>
                            {isSelf && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber/10 px-2 py-0.5 text-xs font-medium text-amber">
                                <ShieldCheck className="h-3 w-3" />
                                当前登录
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-xs text-ink/40">
                            创建于{" "}
                            {new Date(
                              acc.created_at.replace(" ", "T")
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setPwdTarget(acc);
                            setPwdValue("");
                            setError("");
                          }}
                          className="flex items-center gap-1.5 rounded-md border border-navy/15 px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
                        >
                          <KeyRound className="h-4 w-4" />
                          改密码
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => removeAccount(acc)}
                            className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            删除
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-navy/5 bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <UserPlus className="h-5 w-5 text-amber" />
              新增管理员
            </h2>
            <form onSubmit={createAccount} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">
                  用户名
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="至少 3 个字符"
                  className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink/70">
                  密码
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="至少 6 个字符"
                  className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                  autoComplete="off"
                />
              </div>
              {error && !pwdTarget && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={creating}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                创建账号
              </button>
            </form>
          </div>
        </div>
      </div>

      {pwdTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
                <KeyRound className="h-5 w-5 text-amber" />
                修改密码
              </h3>
              <button
                onClick={() => setPwdTarget(null)}
                className="rounded-md p-1 text-ink/40 hover:bg-navy/5 hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink/60">
              为管理员「
              <span className="font-semibold text-navy">
                {pwdTarget.username}
              </span>
              」设置新密码
            </p>
            <form onSubmit={savePassword} className="mt-5 space-y-4">
              <input
                type="text"
                value={pwdValue}
                onChange={(e) => setPwdValue(e.target.value)}
                placeholder="新密码（至少 6 个字符）"
                className="w-full rounded-lg border border-navy/15 px-3.5 py-2.5 text-sm outline-none focus:border-amber focus:ring-1 focus:ring-amber"
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPwdTarget(null)}
                  className="btn-outline-navy flex-1 justify-center"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={savingPwd}
                  className="btn-primary flex-1 justify-center disabled:opacity-60"
                >
                  {savingPwd ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
