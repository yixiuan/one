"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Search } from "lucide-react";

export const runtime = "edge";

interface SeoEntry {
  path: string;
  locale: string;
  title: string;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
}

const presetPaths = ["/", "/about", "/services", "/why-us", "/news", "/contact"];

export default function SeoAdminPage() {
  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [newPath, setNewPath] = useState("/");
  const [newLocale, setNewLocale] = useState("en");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/seo");
    if (res.ok) {
      const data = (await res.json()) as { seo: SeoEntry[] };
      setEntries(data.seo);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (
    path: string,
    locale: string,
    field: keyof SeoEntry,
    value: string
  ) => {
    setEntries((es) =>
      es.map((e) =>
        e.path === path && e.locale === locale ? { ...e, [field]: value } : e
      )
    );
  };

  const save = async (entry: SeoEntry) => {
    const id = `${entry.path}:${entry.locale}`;
    setSavingId(id);
    await fetch("/api/seo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: entry.path,
        locale: entry.locale,
        title: entry.title,
        description: entry.description,
        keywords: entry.keywords,
        ogImage: entry.og_image,
      }),
    });
    setSavingId("");
  };

  const addEntry = () => {
    if (entries.some((e) => e.path === newPath && e.locale === newLocale)) return;
    setEntries((es) => [
      ...es,
      {
        path: newPath,
        locale: newLocale,
        title: "",
        description: "",
        keywords: "",
        og_image: "",
      },
    ]);
  };

  const fieldClass =
    "w-full rounded-md border border-navy/15 bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">
          SEO Settings
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Manage meta title, description, keywords and OG image for each page.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-navy/5 bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
          <Plus className="h-4 w-4 text-amber" />
          Add Page SEO
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            className={`${fieldClass} flex-1`}
          >
            {presetPaths.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={newLocale}
            onChange={(e) => setNewLocale(e.target.value)}
            className={`${fieldClass} w-32`}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
          <button onClick={addEntry} className="btn-primary">
            Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-navy/5 bg-white p-16 text-center text-ink/50">
          <Search className="mx-auto h-10 w-10 text-ink/20" />
          <p className="mt-4">No SEO entries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((e) => {
            const id = `${e.path}:${e.locale}`;
            return (
              <div
                key={id}
                className="rounded-2xl border border-navy/5 bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-navy">
                    {e.path}
                    <span className="ml-2 rounded bg-mist px-2 py-0.5 text-xs text-ink/50">
                      {e.locale.toUpperCase()}
                    </span>
                  </span>
                  <button
                    onClick={() => save(e)}
                    disabled={savingId === id}
                    className="btn-outline-navy !px-4 !py-2 text-xs disabled:opacity-70"
                  >
                    {savingId === id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink/60">
                      Meta Title
                    </label>
                    <input
                      value={e.title}
                      onChange={(ev) =>
                        updateField(e.path, e.locale, "title", ev.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-ink/60">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={e.description ?? ""}
                      onChange={(ev) =>
                        updateField(
                          e.path,
                          e.locale,
                          "description",
                          ev.target.value
                        )
                      }
                      className={`${fieldClass} resize-none`}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-ink/60">
                        Keywords
                      </label>
                      <input
                        value={e.keywords ?? ""}
                        onChange={(ev) =>
                          updateField(
                            e.path,
                            e.locale,
                            "keywords",
                            ev.target.value
                          )
                        }
                        className={fieldClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-ink/60">
                        OG Image URL
                      </label>
                      <input
                        value={e.og_image ?? ""}
                        onChange={(ev) =>
                          updateField(
                            e.path,
                            e.locale,
                            "og_image",
                            ev.target.value
                          )
                        }
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
