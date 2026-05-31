import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import PageHero from "@/components/PageHero";
import Timeline from "@/components/Timeline";
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
  return pageMetadata(params.locale, "/about", {
    title: `${dict.about.title} — NexShore Technologies`,
    description: dict.about.intro.slice(0, 160),
  });
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = resolveLocale(params.locale);
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        image="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20corporate%20office%20engineering%20team%20meeting%20industrial%20china%20professional%20blue&image_size=landscape_16_9"
      />

      <section className="bg-white py-24">
        <div className="container-page grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-lg leading-relaxed text-ink/80">
              {dict.about.intro}
            </p>
            <h2 className="mt-12 font-display text-2xl font-bold text-navy">
              {dict.about.evolutionTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/80">
              {dict.about.evolution}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=precision%20engineering%20cnc%20machine%20industrial%20automation%20factory%20blue%20toned%20professional&image_size=portrait_4_3"
                alt="NexShore engineering"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-mist py-24">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Our Journey</span>
            <h2 className="section-title mt-4">15+ Years of Growth</h2>
          </Reveal>
          <Timeline dict={dict} />
        </div>
      </section>

      <WhyUs dict={dict} />
      <CtaSection locale={locale} dict={dict} />
    </>
  );
}
