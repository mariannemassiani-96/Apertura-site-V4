"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { MOTION } from "@/components/home/utils/motion";

export default function CalloutCurve() {
  const rootRef = useRef<HTMLElement | null>(null);
  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!rootRef.current) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const path = root.querySelector<SVGPathElement>("[data-curve-path]");
      const label = root.querySelector<HTMLElement>("[data-curve-label]");
      const copy = root.querySelector<HTMLElement>("[data-curve-copy]");

      if (!path || !label || !copy) return;

      const length = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.9,
      });

      gsap.set(label, { x: -40, opacity: 0.9, willChange: "transform,opacity" });
      gsap.set(copy, { y: 14, opacity: 0, willChange: "transform,opacity" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=160%",
          scrub: MOTION.scrub,
          pin: isDesktop,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);

      // Label qui “glisse” (le feel savor)
      tl.to(label, { x: 60, opacity: 1, ease: "none" }, 0.05);

      // Texte à droite qui arrive (sobre)
      tl.to(copy, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.25);
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.08),transparent_60%)]" />

      <div className="relative mx-auto min-h-[92svh] max-w-6xl px-4 py-20 md:px-8 lg:py-28">
        <div className="relative">
          {/* Label “from — to” (tu mets ton texte exact) */}
          <div
            data-curve-label
            className="relative z-10 mx-auto flex max-w-3xl items-center gap-6 text-sm text-ivoire/80"
          >
            <span className="whitespace-nowrap">De la matière brute</span>
            <span className="h-px flex-1 bg-ivoire/25" />
            <span className="whitespace-nowrap">à la lumière</span>
          </div>

          {/* Courbe */}
          <div className="relative mt-10">
            <svg
              className="h-[46svh] w-full"
              viewBox="0 0 1200 520"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                data-curve-path
                d="M240 60 C 520 90, 460 370, 720 400 C 910 420, 980 340, 1040 300"
                stroke="rgba(244,247,249,0.55)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Copy à droite (tu gardes ton texte marketing existant) */}
            <div className="pointer-events-none absolute bottom-12 right-0 max-w-sm text-left">
              <div data-curve-copy className="text-ivoire/90 text-[18px] leading-[1.3] md:text-[22px]">
                {/* mets ici ton texte existant */}
                Nous fabriquons des ouvertures pensées pour laisser entrer la lumière.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
