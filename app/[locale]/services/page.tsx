import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getDictionary } from "@/i18n";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import PageHero from "@/components/PageHero";
import CtaSection from "@/components/CtaSection";
import Reveal from "@/components/Reveal";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const dict = getDictionary(resolveLocale(params.locale));
  return pageMetadata(params.locale, "/services", {
    title: `${dict.nav.services} — NexShore Technologies`,
    description: dict.servicesOverview.subtitle,
  });
}

const images: Record<string, string> = {
  consulting:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=engineers%20technical%20consulting%20product%20design%20blueprint%20cad%20industrial%20professional&image_size=landscape_4_3",
  sourcing:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20handshake%20factory%20supplier%20negotiation%20china%20manufacturing%20professional&image_size=landscape_4_3",
  auditing:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=factory%20audit%20inspector%20production%20line%20assessment%20industrial%20clipboard%20professional&image_size=landscape_4_3",
  inspection:
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quality%20control%20inspection%20measuring%20product%20precision%20instrument%20industrial%20professional&image_size=landscape_4_3",
};

export default function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = resolveLocale(params.locale);
  const dict = getDictionary(locale);

  const services = [
    { key: "consulting", ...dict.services.consulting },
    { key: "sourcing", ...dict.services.sourcing },
    { key: "auditing", ...dict.services.auditing },
    { key: "inspection", ...dict.services.inspection },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.servicesOverview.eyebrow}
        title={dict.servicesOverview.title}
        subtitle={dict.servicesOverview.subtitle}
      />

      <section className="bg-white">
        {services.map((s, i) => (
          <div
            key={s.key}
            id={s.key}
            className={`scroll-mt-24 ${i % 2 === 1 ? "bg-mist" : "bg-white"}`}
          >
            <div className="container-page py-20 lg:py-28">
              <div
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <Reveal>
                  <div className="overflow-hidden rounded-2xl shadow-xl shadow-navy/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[s.key]}
                      alt={s.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/5 text-2xl">
                      {s.icon}
                    </span>
                    <span className="font-display text-sm font-bold uppercase tracking-wider text-amber">
                      0{i + 1}
                    </span>
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-bold text-navy">
                    {s.title}
                  </h2>
                  <p className="mt-5 text-lg leading-relaxed text-ink/75">
                    {s.desc}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-navy/70">
                    <CheckCircle2 className="h-5 w-5 text-amber" />
                    <span>{s.short}</span>
                  </div>
                  <Link
                    href={`/${locale}/contact`}
                    className="btn-outline-navy mt-8"
                  >
                    {dict.nav.getQuote}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        ))}
      </section>

      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
