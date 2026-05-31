import { Compass, Cpu, Layers, ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/i18n";
import Reveal from "../Reveal";

const icons = [Compass, Cpu, Layers, ShieldCheck];

export default function WhyUs({ dict }: { dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-navy py-24">
      <div
        className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-steel/30 blur-[140px]"
        aria-hidden
      />
      <div className="container-page relative">
        <div className="grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow">{dict.whyUs.eyebrow}</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              {dict.whyUs.title}
            </h2>
            <p className="mt-6 text-lg italic text-white/60">
              &ldquo;{dict.stats.subtitle}&rdquo;
            </p>
          </Reveal>

          <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:col-span-8">
            {dict.whyUs.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={item.title} delay={i * 0.08}>
                  <div className="group h-full bg-navy p-8 transition-colors hover:bg-navy-700">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber/10 text-amber transition-colors group-hover:bg-amber group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">
                      {item.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
