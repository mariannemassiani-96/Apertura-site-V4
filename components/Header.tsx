"use client";

import Link from "next/link";
import { useState } from "react";
import { siteContent, labels } from "@/lib/content";
import clsx from "clsx";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { navigation } = siteContent;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-graphite/80 backdrop-blur-md text-ivoire">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-sm uppercase tracking-wide">
          {siteContent.brand.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label={siteContent.navigation.mobile.menuLabel}>
          {navigation.main.map((item) => (
            <div key={item.href} className="relative">
              {item.hasMega ? (
                <div className="group">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm uppercase tracking-wide"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {item.label}
                  </button>
                  <div className="absolute left-1/2 top-full hidden w-[540px] -translate-x-1/2 pt-4 group-hover:block">
                    <div className="rounded-2xl bg-graphite/95 p-6 shadow-soft">
                      <div className="mb-4 text-xs uppercase tracking-wide text-cuivre">
                        {navigation.megaMenu.title}
                      </div>
                      <p className="mb-6 whitespace-pre-line text-sm text-ivoire/80">
                        {navigation.megaMenu.description}
                      </p>
                      <div className="grid gap-3">
                        {navigation.megaMenu.cards.map((card) => (
                          <Link
                            key={card.href}
                            href={card.href}
                            className="rounded-xl border border-ivoire/10 p-4 transition hover:border-cuivre/60"
                          >
                            <div className="text-sm font-semibold text-ivoire">{card.title}</div>
                            <div className="text-xs text-ivoire/70">{card.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href={item.href} className="text-sm uppercase tracking-wide">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link
            href={navigation.proCta.href}
            className="rounded-full border border-cuivre px-4 py-2 text-xs uppercase tracking-wide text-cuivre transition hover:bg-cuivre hover:text-graphite"
          >
            {navigation.proCta.label}
          </Link>
        </nav>
        <button
          type="button"
          className="flex items-center gap-2 text-xs uppercase tracking-wide md:hidden"
          aria-label={open ? navigation.mobile.closeLabel : navigation.mobile.toggleLabel}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? navigation.mobile.closeText : navigation.mobile.toggleText}
        </button>
      </div>
      <div
        className={clsx(
          "md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="space-y-4 bg-graphite px-5 py-6">
          <div className="text-xs uppercase tracking-wide text-ivoire/60">
            {navigation.mobile.menuLabel}
          </div>
          <div className="space-y-3">
            {navigation.main
              .filter((item) => !item.hasMega)
              .map((item) => (
                <Link key={item.href} href={item.href} className="block text-sm" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ))}
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm"
              onClick={() => setSolutionsOpen((prev) => !prev)}
              aria-expanded={solutionsOpen}
            >
              {navigation.mobile.solutionsLabel}
              <span aria-hidden>{labels.symbols.expand}</span>
            </button>
            {solutionsOpen && (
              <div className="space-y-2 border-l border-ivoire/20 pl-4 text-xs text-ivoire/80">
                {navigation.mobile.solutionsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href={navigation.proCta.href}
            className="mt-6 inline-flex w-full justify-center rounded-full border border-cuivre px-4 py-3 text-xs uppercase tracking-wide text-cuivre"
            onClick={() => setOpen(false)}
          >
            {navigation.proCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
};
