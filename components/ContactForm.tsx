"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import type { Dictionary } from "@/i18n";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success: boolean };
      if (res.ok && data.success) {
        setStatus("success");
        setForm({ name: "", company: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-amber/20 bg-amber/5 p-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-amber" />
        <p className="mt-5 max-w-md text-lg font-medium text-navy">
          {dict.contact.formSuccess}
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-outline-navy mt-8"
        >
          {dict.contact.formSubmit}
        </button>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-md border border-navy/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-amber focus:ring-2 focus:ring-amber/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            {dict.contact.formName} *
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className={fieldClass}
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            {dict.contact.formCompany}
          </label>
          <input
            value={form.company}
            onChange={update("company")}
            className={fieldClass}
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            {dict.contact.formEmail} *
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className={fieldClass}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-navy">
            {dict.contact.formPhone}
          </label>
          <input
            value={form.phone}
            onChange={update("phone")}
            className={fieldClass}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">
          {dict.contact.formMessage} *
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className={`${fieldClass} resize-none`}
          placeholder="Tell us about your sourcing or manufacturing needs..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-red-600">
          {dict.contact.formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full !py-3.5 text-base disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {dict.contact.formSending}
          </>
        ) : (
          <>
            {dict.contact.formSubmit}
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
