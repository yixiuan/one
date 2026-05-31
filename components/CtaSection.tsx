import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import Reveal from "./Reveal";

export default function CtaSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <section className="relative overflow-hidden bg-navy py-20">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-40" />
      <div
        className="absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber/20 blur-[120px]"
        aria-hidden
      />
      <div className="container-page relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="mt-5 text-lg text-white/70">{dict.cta.subtitle}</p>
          <Link
            href={`/${locale}/contact`}
            className="btn-primary mt-8 !px-8 !py-4 text-base"
          >
            {dict.cta.button}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
