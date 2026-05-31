"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, FileText } from "lucide-react";

export const runtime = "edge";

interface Block {
  key: string;
  locale: string;
  value: string;
}

const presetKeys = [
  "home_hero_title",
  "home_hero_subtitle",
  "about_intro",
  "contact_address",
];

export default function ContentAdminPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newLocale, setNewLocale] = useState("en");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/content");
    if (res.ok) {
      const data = (await res.json()) as { blocks: Block[] };
      setBlocks(data.blocks);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateValue = (key: string, locale: string, value: string) => {
    setBlocks((bs) =>
      bs.map((b) => (b.key === key && b.locale === locale ? { ...b, value } : b))
    );
  };

  const save = async (block: Block) => {
    setSavingKey(`${block.key}:${block.locale}`);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(block),
    });
    setSavingKey("");
  };

  const addBlock = () => {
    const key = newKey.trim();
    if (!key) return;
    if (blocks.some((b) => b.key === key && b.locale === newLocale)) return;
    setBlocks((bs) => [...bs, { key, locale: newLocale, value: "" }]);
    setNewKey("");
  };

  const fieldClass =
    "w-full rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">
          Content Management
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Manage editable content blocks for your website pages.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-navy/5 bg-white p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-navy">
          <Plus className="h-4 w-4 text-amber" />
          Add Content Block
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            list="preset-keys"
            placeholder="content_key"
            className={`${fieldClass} flex-1`}
          />
          <datalist id="preset-keys">
            {presetKeys.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>
          <select
            value={newLocale}
            onChange={(e) => setNewLocale(e.target.value)}
            className={`${fieldClass} w-32`}
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
          <button onClick={addBlock} className="btn-primary">
            Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
        </div>
      ) : blocks.length === 0 ? (
        <div className="rounded-2xl border border-navy/5 bg-white p-16 text-center text-ink/50">
          <FileText className="mx-auto h-10 w-10 text-ink/20" />
          <p className="mt-4">
            No content blocks yet. Add one above to override default page text.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((b) => {
            const id = `${b.key}:${b.locale}`;
            return (
              <div
                key={id}
                className="rounded-2xl border border-navy/5 bg-white p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-navy">
                    {b.key}
                    <span className="ml-2 rounded bg-mist px-2 py-0.5 text-xs text-ink/50">
                      {b.locale.toUpperCase()}
                    </span>
                  </span>
                  <button
                    onClick={() => save(b)}
                    disabled={savingKey === id}
                    className="btn-outline-navy !px-4 !py-2 text-xs disabled:opacity-70"
                  >
                    {savingKey === id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={b.value}
                  onChange={(e) => updateValue(b.key, b.locale, e.target.value)}
                  className={`${fieldClass} resize-y`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
