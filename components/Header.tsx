"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/services`, label: dict.nav.services },
    { href: `/${locale}/why-us`, label: dict.nav.whyUs },
    { href: `/${locale}/news`, label: dict.nav.news },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const switchPath = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-navy/95 shadow-lg shadow-navy/20 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber font-display text-lg font-black text-white">
            N
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-white">
            NexShore<span className="text-amber">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "text-amber"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="group relative">
            <button className="flex items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white">
              <Globe className="h-4 w-4" />
              {locale === "en" ? "EN" : "中文"}
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="invisible absolute right-0 top-full w-32 translate-y-2 rounded-md border border-white/10 bg-navy py-1 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <Link
                href={switchPath("en")}
                className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-amber"
              >
                English
              </Link>
              <Link
                href={switchPath("zh")}
                className="block px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-amber"
              >
                中文
              </Link>
            </div>
          </div>
          <Link href={`/${locale}/contact`} className="btn-primary !py-2.5">
            {dict.nav.getQuote}
          </Link>
        </div>

        <button
          className="text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy lg:hidden">
          <nav className="container-page flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`py-3 text-base font-medium ${
                  isActive(item.href) ? "text-amber" : "text-white/85"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-4">
              <Link
                href={switchPath("en")}
                className={`rounded px-3 py-1.5 text-sm ${
                  locale === "en" ? "bg-amber text-white" : "text-white/70"
                }`}
              >
                EN
              </Link>
              <Link
                href={switchPath("zh")}
                className={`rounded px-3 py-1.5 text-sm ${
                  locale === "zh" ? "bg-amber text-white" : "text-white/70"
                }`}
              >
                中文
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="btn-primary ml-auto !py-2"
              >
                {dict.nav.getQuote}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
