import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import type { Article } from "@/lib/db";
import ArticleCard from "../ArticleCard";
import Reveal from "../Reveal";

export default function NewsPreview({
  articles,
  locale,
  dict,
}: {
  articles: Article[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (articles.length === 0) return null;

  return (
    <section className="bg-mist py-24">
      <div className="container-page">
        <Reveal className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="eyebrow">{dict.news.eyebrow}</span>
            <h2 className="section-title mt-4">{dict.news.title}</h2>
            <p className="mt-4 text-lg text-ink/70">{dict.news.subtitle}</p>
          </div>
          <Link
            href={`/${locale}/news`}
            className="btn-outline-navy shrink-0"
          >
            {dict.news.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, i) => (
            <Reveal key={article.id} delay={i * 0.08}>
              <ArticleCard article={article} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
