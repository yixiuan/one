import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import PageHero from "@/components/PageHero";
import WhyUs from "@/components/home/WhyUs";
import CtaSection from "@/components/CtaSection";
import Reveal from "@/components/Reveal";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const dict = getDictionary(resolveLocale(params.locale));
  return pageMetadata(params.locale, "/why-us", {
    title: `${dict.whyUs.title} — NexShore Technologies`,
    description: dict.whyUs.items.map((i) => i.title).join(", "),
  });
}

export default function WhyUsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = resolveLocale(params.locale);
  const dict = getDictionary(locale);

  const highlights = [
    { value: "15+", label: dict.hero.stat1Label },
    { value: "100%", label: dict.hero.stat2Label },
    { value: "4", label: dict.hero.stat3Label },
    { value: "1", label: dict.whyUs.items[2].title },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.whyUs.eyebrow}
        title={dict.whyUs.title}
        subtitle={dict.stats.subtitle}
      />

      <section className="bg-white py-20">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="rounded-2xl border border-navy/5 bg-mist p-8 text-center">
                <div className="font-display text-4xl font-extrabold text-amber">
                  {h.value}
                </div>
                <div className="mt-3 text-sm font-medium text-ink/70">
                  {h.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyUs dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
