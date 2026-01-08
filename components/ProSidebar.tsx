"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { siteContent } from "@/lib/content";

export const ProSidebar = () => {
  const pathname = usePathname();
  const { sidebar, sidebarTitle } = siteContent.pro;

  const items = [
    { label: sidebar.dashboard, href: "/pro/dashboard" },
    { label: sidebar.configurateur, href: "/pro/configurateur" },
    { label: sidebar.quotes, href: "/pro/devis" },
    { label: sidebar.cart, href: "/pro/panier" },
    { label: sidebar.requests, href: "/pro/demandes" },
    { label: sidebar.support, href: "/pro/support" },
    { label: sidebar.mentions, href: "/pro/mentions" },
  ];

  return (
    <aside className="hidden w-64 flex-col gap-6 border-r border-ivoire/10 bg-graphite px-6 py-10 text-ivoire md:flex">
      <div className="text-xs uppercase tracking-wide text-ivoire/60">{sidebarTitle}</div>
      <nav className="space-y-2 text-sm">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "block rounded-full px-3 py-2 transition",
              pathname === item.href ? "bg-cuivre text-graphite" : "text-ivoire/80 hover:text-ivoire",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
