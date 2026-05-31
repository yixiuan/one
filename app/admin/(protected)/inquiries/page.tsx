"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Check, Loader2, Building2, Phone } from "lucide-react";

export const runtime = "edge";

interface Inquiry {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  is_read: number;
  created_at: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/inquiries");
    if (res.ok) {
      const data = (await res.json()) as { inquiries: Inquiry[] };
      setInquiries(data.inquiries);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (inq: Inquiry) => {
    await fetch(`/api/inquiries/${inq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !inq.is_read }),
    });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  const openInquiry = (inq: Inquiry) => {
    setSelected(inq);
    if (!inq.is_read) markRead(inq);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">Inquiries</h1>
        <p className="mt-1 text-sm text-ink/60">
          Customer inquiries submitted through the contact form.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="rounded-2xl border border-navy/5 bg-white p-16 text-center text-ink/50">
          No inquiries yet.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            {inquiries.map((inq) => (
              <button
                key={inq.id}
                onClick={() => openInquiry(inq)}
                className={`w-full rounded-xl border bg-white p-4 text-left transition-colors ${
                  selected?.id === inq.id
                    ? "border-amber ring-1 ring-amber"
                    : "border-navy/5 hover:border-navy/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-navy">{inq.name}</span>
                  {!inq.is_read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                  )}
                </div>
                <div className="mt-1 truncate text-sm text-ink/60">
                  {inq.email}
                </div>
                <div className="mt-2 line-clamp-1 text-xs text-ink/50">
                  {inq.message}
                </div>
                <div className="mt-2 text-xs text-ink/40">
                  {new Date(inq.created_at.replace(" ", "T")).toLocaleString()}
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {selected ? (
              <div className="rounded-2xl border border-navy/5 bg-white p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy">
                      {selected.name}
                    </h2>
                    <a
                      href={`mailto:${selected.email}`}
                      className="mt-1 flex items-center gap-2 text-sm text-amber hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {selected.email}
                    </a>
                  </div>
                  <button
                    onClick={() => remove(selected.id)}
                    className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {selected.company && (
                    <div className="flex items-center gap-2 text-sm text-ink/70">
                      <Building2 className="h-4 w-4 text-ink/40" />
                      {selected.company}
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-center gap-2 text-sm text-ink/70">
                      <Phone className="h-4 w-4 text-ink/40" />
                      {selected.phone}
                    </div>
                  )}
                </div>

                <div className="mt-6 rounded-xl bg-mist p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                    {selected.message}
                  </p>
                </div>

                <button
                  onClick={() => markRead(selected)}
                  className="btn-outline-navy mt-6"
                >
                  <Check className="h-4 w-4" />
                  Mark as {selected.is_read ? "unread" : "read"}
                </button>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-white p-16 text-center text-ink/40">
                Select an inquiry to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
