"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export const runtime = "edge";

interface ArticleForm {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: string;
}

const empty: ArticleForm = {
  slug: "",
  locale: "en",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  status: "draft",
};

export default function NewsEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const isNew = params.id === "new";
  const [form, setForm] = useState<ArticleForm>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/articles/${params.id}`);
      if (res.ok) {
        const data = (await res.json()) as {
          article: {
            slug: string;
            locale: string;
            title: string;
            excerpt: string | null;
            content: string;
            cover_image: string | null;
            status: string;
          };
        };
        setForm({
          slug: data.article.slug,
          locale: data.article.locale,
          title: data.article.title,
          excerpt: data.article.excerpt ?? "",
          content: data.article.content,
          coverImage: data.article.cover_image ?? "",
          status: data.article.status,
        });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const update =
    (key: keyof ArticleForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(
      isNew ? "/api/articles" : `/api/articles/${params.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    if (res.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Failed to save");
      setSaving(false);
    }
  };

  const fieldClass =
    "w-full rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20";

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-2 text-sm font-semibold text-amber hover:text-amber-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold text-navy">
        {isNew ? "New Article" : "Edit Article"}
      </h1>

      <div className="mt-8 space-y-5 rounded-2xl border border-navy/5 bg-white p-8">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Title *
          </label>
          <input value={form.title} onChange={update("title")} className={fieldClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">
              Slug (auto if empty)
            </label>
            <input value={form.slug} onChange={update("slug")} className={fieldClass} placeholder="my-article-slug" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy">
              Locale
            </label>
            <select value={form.locale} onChange={update("locale")} className={fieldClass}>
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Cover Image URL
          </label>
          <input value={form.coverImage} onChange={update("coverImage")} className={fieldClass} placeholder="https://..." />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Excerpt
          </label>
          <textarea rows={2} value={form.excerpt} onChange={update("excerpt")} className={`${fieldClass} resize-none`} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Content * (one paragraph per line)
          </label>
          <textarea rows={12} value={form.content} onChange={update("content")} className={`${fieldClass} resize-y font-mono`} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Status
          </label>
          <select value={form.status} onChange={update("status")} className={fieldClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}

        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Article
        </button>
      </div>
    </div>
  );
}
