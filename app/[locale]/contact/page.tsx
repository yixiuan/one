import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getDictionary } from "@/i18n";
import { pageMetadata, resolveLocale } from "@/lib/page-meta";
import { siteConfig } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const runtime = "edge";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const dict = getDictionary(resolveLocale(params.locale));
  return pageMetadata(params.locale, "/contact", {
    title: `${dict.contact.title} — NexShore Technologies`,
    description: dict.contact.subtitle,
  });
}

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const dict = getDictionary(resolveLocale(params.locale));

  const info = [
    {
      icon: MapPin,
      label: dict.contact.address,
      value: dict.contact.addressValue,
    },
    { icon: Mail, label: dict.contact.email, value: siteConfig.email },
    { icon: Phone, label: dict.contact.phone, value: siteConfig.phone },
  ];

  return (
    <>
      <PageHero
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
      />

      <section className="bg-mist py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-2xl font-bold text-navy">
              {dict.contact.infoTitle}
            </h2>
            <div className="mt-8 space-y-6">
              {info.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-amber">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-ink/50">
                      {item.label}
                    </div>
                    <div className="mt-1 font-medium text-navy">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shenzhen%20china%20modern%20city%20skyline%20business%20district%20aerial%20blue%20professional&image_size=landscape_4_3"
                alt="Our location"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-2xl border border-navy/5 bg-white p-8 shadow-xl shadow-navy/5 lg:p-10">
              <ContactForm dict={dict} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
