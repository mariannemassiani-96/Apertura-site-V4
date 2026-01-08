"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function HomeHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLVideoElement | null>(null);

  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!rootRef.current || !mediaRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top top",
          end: "+=600",
          scrub: 0.8,
          pin: isDesktop, // pin léger desktop only
          anticipatePin: 1,
        },
      });

      // scale très faible, savor-like
      tl.fromTo(mediaRef.current!, { scale: 1 }, { scale: 1.05, ease: "none" }, 0);

      // texte: fade + léger y
      tl.fromTo(
        "[data-hero-text]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "none" },
        0.05
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative min-h-[100svh] overflow-hidden">
      <video
        ref={mediaRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/home/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Overlay sombre (mobile un peu plus opaque) */}
      <div className="absolute inset-0 bg-black/45 md:bg-black/35" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 md:px-8 md:pb-16">
        <div data-hero-text className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-ivoire/70">APERTURA DI CORSICA</p>

          <h1 className="mt-4 text-3xl font-medium leading-tight md:text-5xl">
            Ouvrir, c’est laisser entrer la lumière.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-ivoire/75 md:text-lg">
            Menuiseries aluminium &amp; PVC — fabrication corse
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-ivoire/70">
            <span className="inline-block h-[1px] w-10 bg-ivoire/30" />
            <span>Découvrir</span>
          </div>
        </div>
      </div>
    </section>
  );
}
