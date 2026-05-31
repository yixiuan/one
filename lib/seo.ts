import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export const siteConfig = {
  name: "NexShore Technologies",
  legalName: "NexShore Technologies Co., Ltd.",
  url: "https://www.nexshore-tech.com",
  defaultOgImage:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=NexShore%20Technologies%20industrial%20manufacturing%20sourcing%20china%20professional%20blue%20brand%20banner&image_size=landscape_16_9",
  email: "contact@nexshore-tech.com",
  phone: "+86 755 0000 0000",
};

interface BuildMetadataOptions {
  locale: Locale;
  path: string;
  title: string;
  description?: string | null;
  keywords?: string | null;
  ogImage?: string | null;
}

export function buildMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  ogImage,
}: BuildMetadataOptions): Metadata {
  const url = `${siteConfig.url}/${locale}${path === "/" ? "" : path}`;
  const image = ogImage || siteConfig.defaultOgImage;

  return {
    title,
    description: description ?? undefined,
    keywords: keywords ?? undefined,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path === "/" ? "" : path}`,
        zh: `${siteConfig.url}/zh${path === "/" ? "" : path}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description: description ?? undefined,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: siteConfig.defaultOgImage,
    description:
      "Technical consulting, sourcing, factory auditing and quality inspection services connecting global businesses with Chinese manufacturing.",
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "sales",
    },
  };
}
