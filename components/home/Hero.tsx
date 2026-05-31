"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

export default function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const stats = [
    { value: dict.hero.stat1, label: dict.hero.stat1Label },
    { value: dict.hero.stat2, label: dict.hero.stat2Label },
    { value: dict.hero.stat3, label: dict.hero.stat3Label },
  ];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-navy pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20industrial%20manufacturing%20facility%20port%20cranes%20containers%20dusk%20blue%20cinematic%20wide%20professional&image_size=landscape_16_9')",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" aria-hidden />

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-amber" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber">
              {dict.hero.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            {dict.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link href={`/${locale}/contact`} className="btn-primary !px-7 !py-3.5 text-base">
              {dict.hero.ctaPrimary}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href={`/${locale}/services`} className="btn-secondary !px-7 !py-3.5 text-base">
              {dict.hero.ctaSecondary}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-5"
        >
          <div className="grid gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.12 }}
                className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <span className="font-display text-4xl font-extrabold text-amber">
                  {s.value}
                </span>
                <span className="text-sm font-medium text-white/70">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
