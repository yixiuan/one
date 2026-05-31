import { Inbox, MailOpen, Newspaper, FileCheck2 } from "lucide-react";
import { getDB } from "@/lib/db";

export const runtime = "edge";

async function getStats() {
  try {
    const db = getDB();
    const totalInquiries = await db
      .prepare("SELECT COUNT(*) as c FROM inquiries")
      .first<{ c: number }>();
    const unreadInquiries = await db
      .prepare("SELECT COUNT(*) as c FROM inquiries WHERE is_read = 0")
      .first<{ c: number }>();
    const totalArticles = await db
      .prepare("SELECT COUNT(*) as c FROM articles")
      .first<{ c: number }>();
    const publishedArticles = await db
      .prepare("SELECT COUNT(*) as c FROM articles WHERE status = 'published'")
      .first<{ c: number }>();
    return {
      total: totalInquiries?.c ?? 0,
      unread: unreadInquiries?.c ?? 0,
      articles: totalArticles?.c ?? 0,
      published: publishedArticles?.c ?? 0,
    };
  } catch {
    return { total: 0, unread: 0, articles: 0, published: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      label: "Total Inquiries",
      value: stats.total,
      icon: Inbox,
      color: "bg-navy",
    },
    {
      label: "Unread Inquiries",
      value: stats.unread,
      icon: MailOpen,
      color: "bg-amber",
    },
    {
      label: "Total Articles",
      value: stats.articles,
      icon: Newspaper,
      color: "bg-steel",
    },
    {
      label: "Published",
      value: stats.published,
      icon: FileCheck2,
      color: "bg-navy-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">
          Welcome back. Here is an overview of your website.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-navy/5 bg-white p-6 shadow-sm"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.color} text-white`}
            >
              <c.icon className="h-6 w-6" />
            </span>
            <div className="mt-5 font-display text-3xl font-extrabold text-navy">
              {c.value}
            </div>
            <div className="mt-1 text-sm font-medium text-ink/60">
              {c.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-navy/5 bg-white p-8 shadow-sm">
        <h2 className="font-display text-lg font-bold text-navy">
          Quick Actions
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/inquiries"
            className="rounded-xl border border-navy/10 p-5 transition-colors hover:border-amber hover:bg-amber/5"
          >
            <Inbox className="h-6 w-6 text-amber" />
            <div className="mt-3 font-semibold text-navy">View Inquiries</div>
          </a>
          <a
            href="/admin/news/edit/new"
            className="rounded-xl border border-navy/10 p-5 transition-colors hover:border-amber hover:bg-amber/5"
          >
            <Newspaper className="h-6 w-6 text-amber" />
            <div className="mt-3 font-semibold text-navy">New Article</div>
          </a>
          <a
            href="/admin/content"
            className="rounded-xl border border-navy/10 p-5 transition-colors hover:border-amber hover:bg-amber/5"
          >
            <FileCheck2 className="h-6 w-6 text-amber" />
            <div className="mt-3 font-semibold text-navy">Edit Content</div>
          </a>
          <a
            href="/admin/seo"
            className="rounded-xl border border-navy/10 p-5 transition-colors hover:border-amber hover:bg-amber/5"
          >
            <FileCheck2 className="h-6 w-6 text-amber" />
            <div className="mt-3 font-semibold text-navy">SEO Settings</div>
          </a>
        </div>
      </div>
    </div>
  );
}
