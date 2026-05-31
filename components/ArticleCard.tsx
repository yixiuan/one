import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { Article } from "@/lib/db";

function formatDate(value: string | null, locale: Locale) {
  if (!value) return "";
  const d = new Date(value.replace(" ", "T"));
  return d.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ArticleCard({
  article,
  locale,
  dict,
}: {
  article: Article;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={`/${locale}/news/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/5"
    >
      <div className="aspect-[16/9] overflow-hidden bg-navy/5">
        {article.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-ink/50">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(article.published_at, locale)}
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy transition-colors group-hover:text-amber">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/65">
          {article.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber">
          {dict.news.readMore}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
