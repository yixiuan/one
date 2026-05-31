import type { Dictionary } from "@/i18n";
import Reveal from "./Reveal";

export default function Timeline({ dict }: { dict: Dictionary }) {
  return (
    <div className="relative mt-12">
      <div
        className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-amber via-navy/20 to-transparent md:left-1/2"
        aria-hidden
      />
      <div className="space-y-10">
        {dict.about.timeline.map((item, i) => (
          <Reveal key={item.year} delay={i * 0.06}>
            <div
              className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                i % 2 === 0
                  ? "md:pr-12 md:text-right"
                  : "md:ml-auto md:pl-12"
              }`}
            >
              <div
                className={`absolute left-2.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-amber bg-white md:left-auto ${
                  i % 2 === 0 ? "md:-right-[7px]" : "md:-left-[7px]"
                }`}
                aria-hidden
              />
              <span className="font-display text-2xl font-extrabold text-amber">
                {item.year}
              </span>
              <h3 className="font-display text-lg font-bold text-navy">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/70">{item.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
