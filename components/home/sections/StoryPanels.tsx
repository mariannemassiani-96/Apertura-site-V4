"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function StoryPanels() {
  const rootRef = useRef<HTMLElement | null>(null);
  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  const panels = useMemo(
    () => [
      {
        n: "01 — Le territoire",
        t: "Ici, la lumière n’est jamais la même.\nElle façonne les paysages, les maisons, les usages.",
        img: "/media/home/rail/01.jpg",
        alt: "Lumière et paysage corse",
      },
      {
        n: "02 — L’atelier",
        t: "Avant d’ouvrir une maison,\nnous ouvrons la matière.",
        img: "/media/home/rail/02.jpg",
        alt: "Atelier de fabrication",
      },
      {
        n: "03 — Les détails",
        t: "La qualité se joue souvent\ndans ce que l’on ne voit pas.",
        img: "/media/home/rail/03.jpg",
        alt: "Détails de menuiserie",
      },
      {
        n: "04 — Le projet",
        t: "Chaque ouverture transforme\nla manière d’habiter.",
        img: "/media/home/rail/04.jpg",
        alt: "Ouverture vers l’extérieur",
      },
    ],
    []
  );

  useEffect(() => {
    if (reduced) return;
    if (!rootRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-story-slide]");

      gsap.set(slides, { opacity: 0 });
      gsap.set(slides[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top top",
          end: () => `+=${panels.length * 900}`,
          scrub: 0.9,
          pin: isDesktop,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      slides.forEach((slide, i) => {
        const next = slides[i + 1];
        if (!next) return;

        tl.to(slide, { opacity: 0, duration: 0.45, ease: "none" }, i + 0.7);
        tl.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: "none" }, i + 0.7);
      });

      tl.fromTo("[data-story-media]", { scale: 1 }, { scale: 1.03, ease: "none", duration: panels.length }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced, panels.length]);

  return (
    <section ref={rootRef as any} className="relative min-h-[100svh] overflow-hidden bg-graphite">
      {panels.map((p) => (
        <div key={p.n} data-story-slide className="absolute inset-0" aria-hidden="true">
          <Image
            data-story-media
            src={p.img}
            alt={p.alt}
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
          />

          {/* Overlay “dark lumineux” : moins noir */}
          <div className="absolute inset-0 bg-black/28 md:bg-black/18" />

          {/* Halo chaud discret (cohérence avec Hero) */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_55%)]" />

          {/* Lisibilité texte (sans noircir tout le visuel) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/45 via-black/16 to-transparent md:from-black/40" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-end px-4 pb-16 pt-24 md:px-8">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.22em] text-ivoire/60">{p.n}</p>
              <p className="mt-4 whitespace-pre-line text-2xl font-medium leading-snug text-ivoire md:text-4xl">
                {p.t}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Mobile: sans pin, tout défile naturellement (lisible) */}
      <div className="pointer-events-none invisible min-h-[100svh]" />
    </section>
  );
}
