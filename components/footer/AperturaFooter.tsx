"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";

export default function AperturaFooter() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop(1024);

  useEffect(() => {
    if (reduced) return;
    if (!rootRef.current) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top 85%",
          end: "top 35%",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      // Reveal "savor-like": opacity + y + légère ouverture/fermeture
      tl.fromTo(
        "[data-ap-word]",
        { opacity: 0, y: 18, letterSpacing: "0.06em" },
        { opacity: 1, y: 0, letterSpacing: "-0.01em", duration: 1, ease: "none" },
        0
      );

      tl.fromTo(
        "[data-ap-sub]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "none" },
        0.25
      );

      tl.fromTo(
        "[data-ap-line]",
        { scaleX: 0, opacity: 0, transformOrigin: "50% 50%" },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "none" },
        0.45
      );

      if (isDesktop) {
        tl.fromTo(
          "[data-ap-stroke]",
          { opacity: 0 },
          { opacity: 0.28, duration: 0.7, ease: "none" },
          0.15
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.14),transparent_58%)]" />

      <div className="relative mx-auto flex min-h-[70svh] max-w-6xl items-center justify-center px-4 py-20 md:px-8">
        <div className="w-full text-center">
          <div className="relative mx-auto select-none px-3 md:px-6">
            {/* Stroke desktop */}
            <div
              data-ap-stroke
              className="pointer-events-none absolute inset-0 hidden select-none lg:block"
              aria-hidden="true"
            >
              <span
                className="block text-[14vw] font-semibold leading-none tracking-tight text-transparent"
                style={{ WebkitTextStroke: "1px rgba(244,247,249,0.30)" }}
              >
                APERTURA
              </span>
            </div>

            {/* Fill */}
            <span data-ap-word className="relative block text-[14vw] font-semibold leading-none tracking-tight text-ivoire">
              APERTURA
            </span>
          </div>

          <p data-ap-sub className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivoire/70 md:text-base">
            Depuis toujours, ouvrir est un art.
          </p>

          <div data-ap-line className="mx-auto mt-10 h-px w-24 bg-cuivre/45" />
        </div>
      </div>
    </section>
  );
}
