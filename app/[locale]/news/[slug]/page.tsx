import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getDictionary } from "@/i18n";
import { resolveLocale } from "@/lib/page-meta";
import { getArticleBySlug } from "@/lib/queries";
import { buildMetadata, siteConfig } from "@/lib/seo";
import type { Locale } from "@/i18n/config";

export const runtime = "edge";

function formatDate(value: string | null, locale: Locale) {
  if (!value) return "";
  const d = new Date(value.replace(" ", "T"));
  return d.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = resolveLocale(params.locale);
  const article = await getArticleBySlug(params.slug, locale);
  if (!article) return { title: "Article Not Found" };
  return buildMetadata({
    locale,
    path: `/news/${article.slug}`,
    title: article.title,
    description: article.excerpt,
    ogImage: article.cover_image,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = resolveLocale(params.locale);
  const dict = getDictionary(locale);
  const article = await getArticleBySlug(params.slug, locale);

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image,
    datePublished: article.published_at,
    author: { "@type": "Organization", name: siteConfig.legalName },
    publisher: { "@type": "Organization", name: siteConfig.legalName },
  };

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-white pt-32">
        <div className="container-page max-w-3xl">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber transition-colors hover:text-amber-dark"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.news.backToNews}
          </Link>

          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-ink/50">
            <CalendarDays className="h-4 w-4" />
            {formatDate(article.published_at, locale)}
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-navy md:text-4xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-5 text-xl leading-relaxed text-ink/70">
              {article.excerpt}
            </p>
          )}
        </div>

        {article.cover_image && (
          <div className="container-page mt-10 max-w-4xl">
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.cover_image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="container-page mt-12 max-w-3xl pb-24">
          <div className="prose-content space-y-6 text-lg leading-relaxed text-ink/80">
            {article.content.split("\n").filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
