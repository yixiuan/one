import Reveal from "./Reveal";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  const bg =
    image ||
    "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20industrial%20blueprint%20technical%20pattern%20dark%20blue%20professional%20texture&image_size=landscape_16_9";

  return (
    <section className="relative overflow-hidden bg-navy pt-32 pb-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('${bg}')` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-30" aria-hidden />
      <div className="container-page relative">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
