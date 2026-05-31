import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import Reveal from "../Reveal";

export default function ServicesGrid({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const services = [
    { key: "consulting", ...dict.services.consulting },
    { key: "sourcing", ...dict.services.sourcing },
    { key: "auditing", ...dict.services.auditing },
    { key: "inspection", ...dict.services.inspection },
  ];

  return (
    <section className="bg-mist py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{dict.servicesOverview.eyebrow}</span>
          <h2 className="section-title mt-4">{dict.servicesOverview.title}</h2>
          <p className="mt-5 text-lg text-ink/70">
            {dict.servicesOverview.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08}>
              <Link
                href={`/${locale}/services#${s.key}`}
                className="group flex h-full flex-col rounded-2xl border border-navy/5 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-amber/30 hover:shadow-xl hover:shadow-navy/5"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/5 text-2xl transition-colors group-hover:bg-amber/10">
                    {s.icon}
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-navy/20 transition-all group-hover:text-amber group-hover:rotate-12" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-navy">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                  {s.short}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
