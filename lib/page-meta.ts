import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getSeoMeta } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export function resolveLocale(value: string): Locale {
  return (isValidLocale(value) ? value : "en") as Locale;
}

export async function pageMetadata(
  localeRaw: string,
  path: string,
  fallback: { title: string; description?: string }
): Promise<Metadata> {
  const locale = resolveLocale(localeRaw);
  const seo = await getSeoMeta(path, locale);
  return buildMetadata({
    locale,
    path,
    title: seo?.title ?? fallback.title,
    description: seo?.description ?? fallback.description ?? null,
    keywords: seo?.keywords,
    ogImage: seo?.og_image,
  });
}
