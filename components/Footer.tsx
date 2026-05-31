import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";
import { siteConfig } from "@/lib/seo";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/why-us`, label: dict.nav.whyUs },
    { href: `/${locale}/news`, label: dict.nav.news },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const services = [
    dict.services.consulting.title,
    dict.services.sourcing.title,
    dict.services.auditing.title,
    dict.services.inspection.title,
  ];

  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber font-display text-lg font-black text-white">
              N
            </span>
            <span className="font-display text-lg font-extrabold text-white">
              NexShore<span className="text-amber">.</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            {dict.footer.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">
            {dict.footer.quickLinks}
          </h4>
          <ul className="mt-5 space-y-3">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-white/60 transition-colors hover:text-amber"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">
            {dict.footer.ourServices}
          </h4>
          <ul className="mt-5 space-y-3">
            {services.map((s) => (
              <li key={s}>
                <Link
                  href={`/${locale}/services`}
                  className="text-sm text-white/60 transition-colors hover:text-amber"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">
            {dict.footer.contactUs}
          </h4>
          <ul className="mt-5 space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <span>{dict.contact.addressValue}</span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-amber"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
              <span>{siteConfig.phone}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} {siteConfig.legalName} {dict.footer.rights}
          </p>
          <p>NexShore Technologies Co., Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
