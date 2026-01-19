"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function AperturaFooter() {
  const rootRef = useRef<HTMLElement | null>(null);

 useEffect(() => {
  if (reduced) return;
  if (!rootRef.current) return;

  ensureGsap();
  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    // ✅ État initial forcé (sinon parfois tu “ne vois rien” bouger)
    gsap.set("[data-ap-word]", { opacity: 0, y: 24, letterSpacing: "0.08em" });
    gsap.set("[data-ap-sub]", { opacity: 0, y: 12 });
    gsap.set("[data-ap-line]", { opacity: 0, scaleX: 0, transformOrigin: "50% 50%" });
    gsap.set("[data-ap-stroke]", { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current!,
        start: "top bottom",
        end: "+=420",
        scrub: 0.9,
        pin: true,              // ✅ pause visuelle façon savor
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // markers: true,        // 🔥 DEBUG (à activer 30s si besoin)
      },
    });

    tl.to(
      "[data-ap-word]",
      { opacity: 1, y: 0, letterSpacing: "-0.01em", duration: 1, ease: "power3.out" },
      0
    )
      .to(
        "[data-ap-sub]",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0.25
      )
      .to(
        "[data-ap-line]",
        { opacity: 1, scaleX: 1, duration: 0.8, ease: "power3.out" },
        0.4
      );

    if (isDesktop) {
      tl.to("[data-ap-stroke]", { opacity: 0.28, duration: 0.9, ease: "power2.out" }, 0.15);
    }
  }, rootRef);

  return () => ctx.revert();
}, [reduced, isDesktop]);


  return (
    <section ref={rootRef as any} className="relative w-full bg-graphite-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.14),transparent_58%)]" />

      {/* ✅ CENTRAGE BÉTON : wrapper full + flex center */}
      <div className="relative w-full">
        <div className="mx-auto flex min-h-[70svh] w-full max-w-6xl items-center justify-center px-4 py-20 md:px-8">
          <div className="w-full text-center">
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

            <p
              data-ap-sub
              className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-ivoire/70 md:text-base"
            >
              Depuis toujours, ouvrir est un art.
            </p>

            <div data-ap-line className="mx-auto mt-10 h-px w-24 bg-cuivre/45" />
          </div>
        </div>
      </div>
    </section>
  );
}
