"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function ShrinkTransition() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!isDesktop) return;
    if (!rootRef.current || !cardRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top top",
          end: "+=900",
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        cardRef.current!,
        { scale: 1, borderRadius: 0, y: 0 },
        { scale: 0.72, borderRadius: 24, y: -10, ease: "none" },
        0
      );

      tl.fromTo(
        "[data-shrink-text]",
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "none" },
        0.1
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite-soft">
      {/* Halo chaud discret (cohérence Home) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.08),transparent_55%)]" />

      <div className="relative mx-auto min-h-[100svh] max-w-6xl px-4 py-16 md:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div
            ref={cardRef}
            className="relative h-[70vh] overflow-hidden rounded-2xl border border-ivoire/12 bg-black/10 lg:h-[78vh]"
          >
            <Image
              src="/media/home/rail/05.jpg"
              alt="Approche matière et détail"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              priority={false}
            />

            {/* Overlay “dark lumineux” (moins noir) */}
            <div className="absolute inset-0 bg-black/18 md:bg-black/14" />

            {/* Gradient bas très léger pour le texte si l’image est sombre */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
          </div>

          <div data-shrink-text className="max-w-xl">
            <p className="text-xs tracking-[0.22em] text-ivoire/60">APPROCHE</p>

            <p className="mt-4 whitespace-pre-line text-2xl font-medium leading-snug text-ivoire md:text-3xl">
              Et lorsque l’on s’approche,
              {"\n"}chaque choix prend du sens.
            </p>

            <p className="mt-4 text-base leading-relaxed text-ivoire/80">
              Une transition simple, sans effet démonstratif. Juste le rythme.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
