"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const media = mediaRef.current!;

      // Init (évite flash)
      gsap.set(media, { scale: 1, willChange: "transform" });
      gsap.set("[data-hero-text]", { opacity: 0, y: 10, willChange: "transform,opacity" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=120%", // plus adaptatif que 600px
          scrub: 0.85,
          pin: isDesktop, // pin léger desktop only
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Micro mouvement (ciné, pas gadget)
      tl.to(media, { scale: 1.055, ease: "none" }, 0);

      // Texte discret (apparition + tenue)
      tl.to(
        "[data-hero-text]",
        { opacity: 1, y: 0, duration: 0.25, ease: "none" },
        0.05
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative -mt-20 h-[100svh] overflow-hidden bg-graphite">
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

      {/* Overlay “dark lumineux” */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/18" />

      {/* Halo chaud discret */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.12),transparent_55%)]" />

      {/* Gradient bas lisibilité */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/45 via-black/18 to-transparent md:from-black/40" />

      {/* Contenu minimal */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 md:px-8 md:pb-12">
        <div data-hero-text className="max-w-md">
          <p className="text-[11px] tracking-[0.28em] text-ivoire/55">APERTURA DI CORSICA</p>

          {/* Scroll hint subtil */}
          <div className="mt-6 flex items-center gap-3 text-[11px] tracking-[0.24em] text-ivoire/55 uppercase">
            <span className="inline-block h-[1px] w-10 bg-ivoire/25" />
            <span>Scroll</span>

            <span className="relative ml-2 inline-flex h-7 w-5 items-start justify-center rounded-full border border-ivoire/25">
              <span
                className={[
                  "mt-1 block h-1 w-1 rounded-full bg-ivoire/60",
                  reduced ? "" : "animate-[homeScrollDot_1.6s_ease-in-out_infinite]",
                ].join(" ")}
              />
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes homeScrollDot {
          0% { transform: translateY(0); opacity: .7; }
          60% { transform: translateY(10px); opacity: .2; }
          100% { transform: translateY(0); opacity: .7; }
        }
      `}</style>
    </section>
  );
}
