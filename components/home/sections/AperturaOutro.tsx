"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function AperturaOutro() {
  const rootRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!rootRef.current || !wordRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const word = wordRef.current!;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        word,
        {
          opacity: 0,
          filter: "blur(10px)",
          clipPath: "inset(0 100% 0 0 round 24px)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0 0% 0 0 round 24px)",
          duration: 1,
          ease: "none",
        }
      );

      if (isDesktop) {
        tl.fromTo(
          "[data-apertura-stroke]",
          { opacity: 0 },
          { opacity: 0.32, duration: 0.6 },
          0.3
        );
      }

      // Petit accent cuivre ultra discret (desktop only)
      if (isDesktop) {
        tl.fromTo(
          "[data-apertura-underline]",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, transformOrigin: "center", duration: 0.6, ease: "none" },
          0.55
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite-soft">
      {/* Halo chaud + respiration (cohérence home) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_60%)]" />
      {/* Vignette très douce pour “cinéma”, sans assombrir */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.14),transparent_58%)]" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl items-center justify-center px-4 py-24 md:px-8 lg:min-h-[100vh]">
        <div className="relative w-full">
          <div ref={wordRef} className="relative mx-auto select-none text-center">
            {/* Stroke layer (desktop) */}
            <div
              data-apertura-stroke
              className="pointer-events-none absolute inset-0 hidden select-none lg:block"
              aria-hidden="true"
            >
              <span
                className="block text-[14vw] font-semibold leading-none tracking-tight text-transparent"
                style={{
                  WebkitTextStroke: "1px rgba(244,247,249,0.30)",
                }}
              >
                APERTURA
              </span>
            </div>

            {/* Fill layer */}
            <span className="relative block text-[14vw] font-semibold leading-none tracking-tight text-ivoire">
              APERTURA
            </span>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-ivoire/70 md:text-base">
            Depuis toujours, ouvrir est un art.
          </p>

          <div className="mx-auto mt-10 h-px w-24 bg-cuivre/45" />
          <div
            data-apertura-underline
            className="mx-auto mt-2 h-px w-10 bg-cuivre/25"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
