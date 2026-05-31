"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Globe } from "lucide-react";

export const runtime = "edge";

interface Article {
  id: number;
  slug: string;
  locale: string;
  title: string;
  status: string;
  published_at: string | null;
  updated_at: string;
}

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/articles?all=1");
    if (res.ok) {
      const data = (await res.json()) as { articles: Article[] };
      setArticles(data.articles);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">News</h1>
          <p className="mt-1 text-sm text-ink/60">
            Manage news articles and blog posts.
          </p>
        </div>
        <Link href="/admin/news/edit/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-navy/5 bg-white p-16 text-center text-ink/50">
          No articles yet. Create your first article.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-navy/5 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy/5 bg-mist text-left text-xs font-semibold uppercase tracking-wider text-ink/50">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Locale</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-mist/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-navy">{a.title}</div>
                    <div className="text-xs text-ink/40">/{a.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-ink/60">
                      <Globe className="h-3.5 w-3.5" />
                      {a.locale.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber/10 text-amber-dark"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink/50">
                    {new Date(a.updated_at.replace(" ", "T")).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/news/edit/${a.id}`}
                        className="rounded-md border border-navy/10 p-2 text-navy transition-colors hover:border-amber hover:text-amber"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => remove(a.id)}
                        className="rounded-md border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
