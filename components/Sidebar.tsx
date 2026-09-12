"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/subscribers", label: "Subscribers" },
  { href: "/blog-categories", label: "Blog Categories" },
  { href: "/blogs", label: "Blogs" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Messages" },
  { href: "/consultations", label: "Consultations" },
  { href: "/availability", label: "Availability" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-white">
      <div className="flex items-center gap-2 border-b border-border px-5 py-5">
        <span className="text-lg font-bold text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          Aramway
        </span>
        <span className="text-xs font-medium text-muted">Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" data-testid="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-${item.href === "/" ? "overview" : item.href.slice(1)}`}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-ink hover:bg-cream-soft"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
