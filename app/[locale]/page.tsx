import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { getSeoMeta, getPublishedArticles } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import WhyUs from "@/components/home/WhyUs";
import NewsPreview from "@/components/home/NewsPreview";
import CtaSection from "@/components/CtaSection";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isValidLocale(params.locale) ? params.locale : "en") as Locale;
  const seo = await getSeoMeta("/", locale);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/",
    title: seo?.title ?? dict.hero.title,
    description: seo?.description ?? dict.hero.subtitle,
    keywords: seo?.keywords,
    ogImage: seo?.og_image,
  });
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = (isValidLocale(params.locale) ? params.locale : "en") as Locale;
  const dict = getDictionary(locale);
  const articles = await getPublishedArticles(locale, 3);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <ServicesGrid locale={locale} dict={dict} />
      <WhyUs dict={dict} />
      <NewsPreview articles={articles} locale={locale} dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
