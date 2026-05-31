"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, ShieldCheck } from "lucide-react";

export const runtime = "edge";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error ?? "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const fieldWrap =
    "flex items-center gap-3 rounded-md border border-navy/15 bg-white px-4 transition-colors focus-within:border-amber focus-within:ring-2 focus-within:ring-amber/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-amber font-display text-2xl font-black text-white">
            N
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            NexShore Admin
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Sign in to manage your website
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-2xl"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Username
              </label>
              <div className={fieldWrap}>
                <User className="h-4 w-4 text-ink/40" />
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy">
                Password
              </label>
              <div className={fieldWrap}>
                <Lock className="h-4 w-4 text-ink/40" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-ink/40">
            Default: admin / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
