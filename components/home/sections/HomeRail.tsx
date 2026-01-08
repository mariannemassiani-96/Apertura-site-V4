"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { siteContent } from "@/lib/content";
import { ensureGsap, gsap, ScrollTrigger } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function HomeRail() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  const images = siteContent.home.rail.images as string[];
  const alts = siteContent.home.rail.alts as string[];

  const items = useMemo(() => {
    return images.map((src, i) => ({
      src,
      alt: alts?.[i] ?? "Image Apertura di Corsica",
      key: `${src}-${i}`,
    }));
  }, [images, alts]);

  useEffect(() => {
    if (!isDesktop) return;
    if (reduced) return;
    if (!rootRef.current || !trackRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const track = trackRef.current!;

      const getMaxX = () => {
        const total = track.scrollWidth;
        const viewport = root.clientWidth;
        return Math.max(0, total - viewport);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(1, getMaxX())}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, { x: () => -getMaxX() });

      // Subtle fade/blur progression (not aggressive)
      const cards = gsap.utils.toArray<HTMLElement>("[data-rail-card]");
      cards.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.9, filter: "blur(0px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            scrollTrigger: {
              trigger: el,
              start: "left center",
              end: "right center",
              scrub: true,
              horizontal: true,
              // Note: ScrollTrigger doesn't truly support horizontal in a pinned vertical setup,
              // so we keep this minimal (no pin here). It's safe and subtle.
            } as any,
          }
        );
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section
      ref={rootRef as any}
      className="relative w-full overflow-hidden bg-graphite"
      aria-label="Galerie Apertura"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_55%)]" />

      {/* Height tuned for iOS: avoid 100vh hard lock */}
      <div className="relative mx-auto flex min-h-[92vh] w-full flex-col justify-center px-4 md:px-8 lg:min-h-[100vh]">
        <header className="relative z-10 max-w-3xl pt-10 lg:pt-16">
          <p className="text-xs tracking-[0.22em] text-ivoire/70">APERTURA DI CORSICA</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight md:text-5xl">
            Ouvrir, c’est laisser entrer la lumière.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivoire/75 md:text-lg">
            Menuiseries aluminium &amp; PVC — fabrication corse
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-ivoire/70">
            <span className="inline-block h-[1px] w-10 bg-ivoire/30" />
            <span>Découvrir</span>
          </div>
        </header>

        {/* Track */}
        <div className="relative z-10 mt-10 lg:mt-14">
          <div
            ref={trackRef}
            className="flex w-max gap-4 pr-8 will-change-transform md:gap-6"
            style={{
              transform: "translate3d(0,0,0)",
            }}
          >
            {items.map((it, i) => (
              <figure
                key={it.key}
                data-rail-card
                className={[
                  "group relative overflow-hidden rounded-2xl border border-ivoire/10 bg-black/20",
                  // sizes: feel savor-like, varied rhythm
                  i % 5 === 0 ? "h-[62vh] w-[78vw] md:h-[64vh] md:w-[56vw] lg:h-[68vh] lg:w-[44vw]" : "",
                  i % 5 === 1 ? "h-[54vh] w-[70vw] md:h-[56vh] md:w-[48vw] lg:h-[58vh] lg:w-[38vw]" : "",
                  i % 5 === 2 ? "h-[58vh] w-[74vw] md:h-[60vh] md:w-[52vw] lg:h-[62vh] lg:w-[40vw]" : "",
                  i % 5 === 3 ? "h-[50vh] w-[66vw] md:h-[52vh] md:w-[46vw] lg:h-[54vh] lg:w-[36vw]" : "",
                  i % 5 === 4 ? "h-[60vh] w-[76vw] md:h-[62vh] md:w-[54vw] lg:h-[66vh] lg:w-[42vw]" : "",
                  // hover subtle desktop only
                  "transition-transform duration-500 lg:hover:-translate-y-1",
                ].join(" ")}
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, (max-width: 1200px) 55vw, 45vw"
                  className="object-cover opacity-95 transition duration-700 will-change-transform lg:group-hover:scale-[1.03]"
                  priority={i < 2}
                />
                {/* subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-70" />
              </figure>
            ))}
          </div>
        </div>

        {/* Mobile fallback hint (no pin) */}
        <div className="relative z-10 mt-10 pb-10 text-xs text-ivoire/55 lg:hidden">
          Faites défiler pour parcourir la galerie.
        </div>
      </div>
    </section>
  );
}
