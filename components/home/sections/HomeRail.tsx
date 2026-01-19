"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { siteContent } from "@/lib/content";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function HomeRail() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  const images = siteContent.home.rail.images as string[];
  const alts = siteContent.home.rail.alts as string[];

  const items = useMemo(
    () =>
      images.map((src, i) => ({
        src,
        alt: alts?.[i] ?? "Image Apertura di Corsica",
        key: `${src}-${i}`,
        variant: i % 6,
      })),
    [images, alts]
  );

  useEffect(() => {
    if (reduced) return;
    if (!rootRef.current) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-rail-card]");

      cards.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.92, y: 10, scale: 1.01 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 55%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite" aria-label="Galerie">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-ivoire/60">GALERIE</p>
          <h2 className="mt-4 text-2xl font-medium leading-tight md:text-4xl">
            Des images pour respirer, entre deux chapitres.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivoire/70 md:text-lg">
            Une progression verticale, simple. La lumière fait le reste.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:gap-6 lg:mt-14 lg:grid-cols-2">
          {items.map((it, idx) => {
            const variant = it.variant;

            const sizeClass =
              variant === 0
                ? "h-[62vh]"
                : variant === 1
                ? "h-[54vh]"
                : variant === 2
                ? "h-[70vh]"
                : variant === 3
                ? "h-[58vh]"
                : variant === 4
                ? "h-[66vh]"
                : "h-[52vh]";

            const spanClass = idx % 7 === 0 ? "lg:col-span-2 lg:h-[76vh]" : "";

            return (
              <figure
                key={it.key}
                data-rail-card
                className={[
                  "group relative overflow-hidden rounded-2xl border border-ivoire/10 bg-black/20",
                  sizeClass,
                  spanClass,
                  "transition-transform duration-500 lg:hover:-translate-y-1",
                ].join(" ")}
              >
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-95 transition duration-700 will-change-transform lg:group-hover:scale-[1.03]"
                  priority={idx < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-70" />
                <figcaption className="absolute bottom-4 left-4 text-xs tracking-[0.22em] text-ivoire/70">
                  {String(idx + 1).padStart(2, "0")}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
