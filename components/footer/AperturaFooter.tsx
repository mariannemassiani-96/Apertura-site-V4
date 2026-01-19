"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function AperturaFooter() {
  const rootRef = useRef<HTMLElement | null>(null);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop(1024);

  useEffect(() => {
    // ⚠️ Pour debug, commente TEMPORAIREMENT cette ligne si tu suspectes “Reduce motion”
    if (reduced) return;
    if (!rootRef.current) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const word = root.querySelector<HTMLElement>("[data-ap-word]");
      const sub = root.querySelector<HTMLElement>("[data-ap-sub]");
      const line = root.querySelector<HTMLElement>("[data-ap-line]");
      const stroke = root.querySelector<HTMLElement>("[data-ap-stroke]");

      if (!word || !sub || !line) return;

      // ✅ état initial forcé
      gsap.set(word, { opacity: 0, y: 24, letterSpacing: "0.08em" });
      gsap.set(sub, { opacity: 0, y: 12 });
      gsap.set(line, { opacity: 0, scaleX: 0, transformOrigin: "50% 50%" });
      if (stroke) gsap.set(stroke, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "+=520", // un peu plus long = respiration visible
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          // ✅ DEBUG impossible à rater
          markers: true,
          onEnter: () => console.log("[AperturaFooter] enter"),
          onLeave: () => console.log("[AperturaFooter] leave"),
        },
      });

      tl.to(
        word,
        { opacity: 1, y: 0, letterSpacing: "-0.01em", duration: 1, ease: "power3.out" },
        0
      )
        .to(sub, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.25)
        .to(line, { opacity: 1, scaleX: 1, duration: 0.8, ease: "power3.out" }, 0.4);

      if (isDesktop && stroke) {
        tl.to(stroke, { opacity: 0.28, duration: 0.9, ease: "power2.out" }, 0.15);
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section ref={rootRef as any} className="relative w-full bg-graphite-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.14),transparent_58%)]" />

      {/* ✅ FULL WIDTH (comme savor) */}
      <div className="relative flex min-h-[75svh] w-full items-center justify-center px-4 py-20 md:px-8">
        <div className="w-full text-center">
          {/* Zone mot = pas de max-width */}
          <div className="relative mx-auto w-full select-none">
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
            <span
              data-ap-word
              className="relative block text-[14vw] font-semibold leading-none tracking-tight text-ivoire"
            >
              APERTURA
            </span>
          </div>

          {/* Sous-texte = contenu */}
          <div className="mx-auto w-full max-w-6xl">
            <p data-ap-sub className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivoire/70 md:text-base">
              Depuis toujours, ouvrir est un art.
            </p>

            <div data-ap-line className="mx-auto mt-10 h-px w-24 bg-cuivre/45" />
          </div>
        </div>
      </div>
    </section>
  );
}
