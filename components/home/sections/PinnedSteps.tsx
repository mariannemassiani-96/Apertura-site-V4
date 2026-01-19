"use client";

import { useEffect, useMemo, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function PinnedSteps() {
  const rootRef = useRef<HTMLElement | null>(null);
  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  const steps = useMemo(
    () => [
      { k: "01", t: "Ici, la lumière n’est jamais la même." },
      { k: "02", t: "Avant d’ouvrir une maison, nous ouvrons la matière." },
      { k: "03", t: "La qualité se joue souvent dans ce que l’on ne voit pas." },
      { k: "04", t: "Chaque ouverture transforme la manière d’habiter." },
      { k: "05", t: "Concevoir, c’est chercher la justesse." },
      { k: "06", t: "Fabriqué ici, pensé pour durer." },
    ],
    []
  );

  useEffect(() => {
    if (!isDesktop) return;
    if (reduced) return;
    if (!rootRef.current) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const items = gsap.utils.toArray<HTMLElement>("[data-step-item]");

      // init
      gsap.set(items, { opacity: 0, y: 10, scale: 1.01, willChange: "transform,opacity" });
      if (items[0]) gsap.set(items[0], { opacity: 1, y: 0, scale: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${steps.length * 320}`,
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      items.forEach((el, idx) => {
        const next = items[idx + 1];
        const at = idx * 1;

        tl.to(el, { opacity: 0, y: -8, scale: 1.01, duration: 0.35 }, at + 0.65);

        if (next) {
          tl.to(next, { opacity: 1, y: 0, scale: 1, duration: 0.45 }, at + 0.75);
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced, steps.length]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite">
      <div className="mx-auto min-h-[92vh] max-w-6xl px-4 py-16 md:px-8 lg:min-h-[100vh] lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.22em] text-ivoire/60">RÉCIT</p>
            <h2 className="mt-4 text-2xl font-medium leading-tight md:text-4xl">
              Une manière d’habiter. Une manière de fabriquer.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ivoire/70 md:text-lg">
              Des phrases courtes, un rythme lent. Le reste est dans la lumière.
            </p>
          </div>

          <div className="relative">
            <div className="relative min-h-[46vh] rounded-2xl border border-ivoire/10 bg-black/20 p-6 md:p-8">
              <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(244,247,249,0.06),transparent_60%)]" />

              <div className="relative">
                {/* Desktop pinned swaps */}
                <div className="hidden lg:block">
                  {steps.map((s) => (
                    <div key={s.k} data-step-item className="absolute left-0 top-0 w-full lg:pr-6">
                      <div className="flex items-start gap-4">
                        <span className="text-xs tracking-[0.22em] text-cuivre">{s.k}</span>
                        <p className="text-xl leading-snug md:text-2xl">{s.t}</p>
                      </div>
                    </div>
                  ))}

                  {/* Spacer for absolute items */}
                  <div className="pointer-events-none invisible h-[46vh]" />
                </div>

                {/* Mobile readable fallback */}
                <div className="space-y-6 lg:hidden">
                  {steps.map((s) => (
                    <div key={`m-${s.k}`} className="flex items-start gap-4">
                      <span className="text-xs tracking-[0.22em] text-cuivre">{s.k}</span>
                      <p className="text-lg leading-snug text-ivoire/90">{s.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-ivoire/55 lg:mt-6">
              Desktop : texte guidé par le scroll. Mobile : lecture libre.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
