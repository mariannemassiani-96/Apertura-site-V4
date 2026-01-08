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

      tl.fromTo(mediaRef.current!, { scale: 1 }, { scale: 1.05, ease: "none" }, 0);

      tl.fromTo(
        "[data-hero-text]",
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "none" },
        0.05
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative min-h-[100svh] overflow-hidden bg-graphite">
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

      {/* Overlay “dark lumineux” : moins noir + plus respirant */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/18" />

      {/* Halo chaud discret (donne la sensation de lumière, sans jaunir) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.12),transparent_55%)]" />

      {/* Gradient bas pour assurer la lisibilité du texte (plus doux que noir plein) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/45 via-black/18 to-transparent md:from-black/40" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-14 pt-24 md:px-8 md:pb-16">
        <div data-hero-text className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] text-ivoire/60">APERTURA DI CORSICA</p>

          <h1 className="mt-4 text-3xl font-medium leading-tight text-ivoire md:text-5xl">
            Ouvrir, c’est laisser entrer la lumière.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-ivoire/80 md:text-lg">
            Menuiseries aluminium &amp; PVC — fabrication corse
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-ivoire/60">
            <span className="inline-block h-[1px] w-10 bg-ivoire/25" />
            <span>Découvrir</span>
          </div>
        </div>
      </div>
    </section>
  );
}
