"use client";

import { useEffect, useMemo, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { MOTION } from "@/components/home/utils/motion";

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

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const items = gsap.utils.toArray<HTMLElement>("[data-step-item]");

      // on met tout en état initial
      gsap.set(items, { opacity: 0, y: MOTION.yIn, willChange: "transform,opacity" });

      // on montre les deux premiers au départ (dense / éditorial)
      if (items[0]) gsap.set(items[0], { opacity: 1, y: 0 });
      if (items[1]) gsap.set(items[1], { opacity: 0.42, y: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${steps.length * 320}`,
          scrub: MOTION.scrub,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // à chaque step, on fait :
      // - l'actif devient “plein”
      // - le suivant devient “preview”
      // - le précédent sort
      steps.forEach((_, idx) => {
        const current = items[idx];
        const next = items[idx + 1];
        const after = items[idx + 2];

        const at = idx * 1;

        if (current) {
          tl.to(current, { opacity: 1, y: 0, duration: 0.35 }, at);
        }

        if (next) {
          tl.to(next, { opacity: 0.42, y: 0, duration: 0.35 }, at + 0.1);
        }

        if (after) {
          // on prépare celui d’après à venir (invisible mais prêt)
          tl.set(after, { opacity: 0, y: MOTION.yIn }, at + 0.1);
        }

        // on fait sortir le courant après une “tenue”
        if (current) {
          tl.to(current, { opacity: 0, y: -8, duration: 0.35 }, at + 0.75);
        }

        // le next prend la place “plein” un peu après
        if (next) {
          tl.to(next, { opacity: 1, y: 0, duration: 0.35 }, at + 0.85);
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced, steps.length]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite">
      <div className="mx-auto min-h-[92vh] max-w-6xl px-4 py-16 md:px-8 lg:min-h-[100vh] lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* Col éditoriale */}
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.22em] text-ivoire/60">RÉCIT</p>
            <h2 className="mt-4 text-2xl font-medium leading-tight md:text-4xl">
              Une manière d’habiter. Une manière de fabriquer.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ivoire/70 md:text-lg">
              Des phrases courtes, un rythme lent. Le reste est dans la lumière.
            </p>

            {/* petit repère discret */}
            <div className="mt-8 hidden items-center gap-3 text-[11px] tracking-[0.22em] text-ivoire/45 lg:flex">
              <span className="h-px w-10 bg-ivoire/20" />
              <span>Lecture guidée</span>
            </div>
          </div>

          {/* Carte éditoriale */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-ivoire/10 bg-ivoire/[0.03] p-7 md:p-10">
              {/* grain / lumière très légère */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,247,249,0.08),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.22),transparent_60%)]" />

              <div className="relative">
                {/* Desktop: stack absolu (2 visibles) */}
                <div className="relative min-h-[40vh] lg:min-h-[44vh]">
                  {steps.map((s) => (
                    <div
                      key={s.k}
                      data-step-item
                      className="absolute left-0 top-0 w-full"
                      aria-hidden="true"
                    >
                      <div className="grid grid-cols-[56px_1fr] gap-4 md:grid-cols-[64px_1fr] md:gap-6">
                        <div className="pt-1 text-[11px] tracking-[0.22em] text-cuivre">
                          {s.k}
                        </div>

                        <div>
                          <p className="text-[22px] leading-snug text-ivoire md:text-[28px]">
                            {s.t}
                          </p>

                          {/* micro “légende” structurelle (pas du marketing) */}
                          <div className="mt-4 text-xs tracking-[0.22em] text-ivoire/35">
                            APERTURA — RÉCIT
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Spacer */}
                  <div className="pointer-events-none invisible h-[44vh]" />
                </div>

                {/* Mobile: lecture libre (dense mais simple) */}
                <div className="space-y-8 lg:hidden">
                  {steps.map((s) => (
                    <div key={`m-${s.k}`} className="grid grid-cols-[56px_1fr] gap-4">
                      <div className="pt-1 text-[11px] tracking-[0.22em] text-cuivre">
                        {s.k}
                      </div>
                      <div>
                        <p className="text-lg leading-snug text-ivoire/90">{s.t}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-ivoire/45 lg:mt-6">
              Desktop : lecture guidée. Mobile : lecture libre.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
