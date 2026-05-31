"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Newspaper,
  FileText,
  Search,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/content", label: "Content (CMS)", icon: FileText },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/accounts", label: "账号管理", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-navy-900 text-white">
      <div className="flex h-20 items-center gap-2.5 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber font-display text-lg font-black text-white">
          N
        </span>
        <span className="font-display text-base font-extrabold">
          NexShore<span className="text-amber">.</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-amber text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-4">
        <Link
          href="/en"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-5 w-5" />
          View Site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
