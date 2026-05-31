import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import { getPublishedArticles } from "@/lib/queries";
import PageHero from "@/components/PageHero";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const dict = getDictionary(resolveLocale(params.locale));
  return pageMetadata(params.locale, "/news", {
    title: `${dict.news.title} — NexShore Technologies`,
    description: dict.news.subtitle,
  });
}

export default async function NewsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = resolveLocale(params.locale);
  const dict = getDictionary(locale);
  const articles = await getPublishedArticles(locale, 50);

  return (
    <>
      <PageHero
        eyebrow={dict.news.eyebrow}
        title={dict.news.title}
        subtitle={dict.news.subtitle}
      />

      <section className="bg-mist py-24">
        <div className="container-page">
          {articles.length === 0 ? (
            <p className="py-20 text-center text-lg text-ink/60">
              {dict.news.empty}
            </p>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <Reveal key={article.id} delay={(i % 3) * 0.08}>
                  <ArticleCard article={article} locale={locale} dict={dict} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
