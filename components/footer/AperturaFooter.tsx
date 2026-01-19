"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

function SplitWordFill({ text }: { text: string }) {
  return (
    <span
      data-ap-word
      aria-label={text}
      className="relative block text-[14vw] font-semibold leading-none tracking-tight text-ivoire"
    >
      <span className="sr-only">{text}</span>

      {/* wrapper utile pour animer aussi le tracking */}
      <span data-ap-wordwrap aria-hidden="true" className="inline-block">
        {Array.from(text).map((ch, i) => (
          <span key={`${ch}-${i}`} data-ap-char className="inline-block will-change-transform">
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

function SplitWordStroke({ text }: { text: string }) {
  return (
    <div data-ap-stroke className="pointer-events-none absolute inset-0 hidden select-none lg:block" aria-hidden="true">
      <span className="block text-[14vw] font-semibold leading-none tracking-tight text-transparent">
        <span className="sr-only">{text}</span>

        <span data-ap-strokewrap className="inline-block" style={{ WebkitTextStroke: "1px rgba(244,247,249,0.30)" }}>
          {Array.from(text).map((ch, i) => (
            <span key={`s-${ch}-${i}`} data-ap-strokechar className="inline-block will-change-transform">
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

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
      const root = rootRef.current!;

      const chars = Array.from(root.querySelectorAll<HTMLElement>("[data-ap-char]"));
      const strokeChars = Array.from(root.querySelectorAll<HTMLElement>("[data-ap-strokechar]"));
      const wordWrap = root.querySelector<HTMLElement>("[data-ap-wordwrap]");
      const strokeWrap = root.querySelector<HTMLElement>("[data-ap-strokewrap]");
      const sub = root.querySelector<HTMLElement>("[data-ap-sub]");
      const line = root.querySelector<HTMLElement>("[data-ap-line]");

      if (!sub || !line || chars.length === 0) return;

      const setInitial = () => {
        gsap.set(chars, { opacity: 0, y: 18 });
        if (wordWrap) gsap.set(wordWrap, { letterSpacing: "0.08em" });

        // stroke (desktop)
        if (isDesktop && strokeChars.length) {
          gsap.set(strokeChars, { opacity: 0, y: 18 });
          if (strokeWrap) gsap.set(strokeWrap, { opacity: 0.28 });
        }

        gsap.set(sub, { opacity: 0, y: 12 });
        gsap.set(line, { opacity: 0, scaleX: 0, transformOrigin: "50% 50%" });
      };

      setInitial();

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // ✅ Lettres qui apparaissent au fur et à mesure (fill)
      tl.to(chars, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0);

      // ✅ Tracking qui se resserre (subtil, premium)
      if (wordWrap) {
        tl.to(wordWrap, { letterSpacing: "-0.01em", duration: 0.8 }, 0);
      }

      // ✅ Stroke letter-by-letter (desktop only)
      if (isDesktop && strokeChars.length) {
        tl.to(strokeChars, { opacity: 1, y: 0, duration: 0.7, stagger: 0.05 }, 0.1);
      }

      tl.to(sub, { opacity: 1, y: 0, duration: 0.8 }, 0.35).to(line, { opacity: 1, scaleX: 1, duration: 0.8 }, 0.5);

      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "+=700",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,

        // ✅ reset pour revoir l’anim même si tu arrives “au milieu”
        onEnter: () => {
          setInitial();
          tl.progress(0).pause(0);
        },
        onEnterBack: () => {
          setInitial();
          tl.progress(0).pause(0);
        },

        // markers: true, // debug si besoin, puis enlever
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section ref={rootRef as any} className="relative w-full bg-graphite-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.14),transparent_58%)]" />

      {/* FULL WIDTH comme savor */}
      <div className="relative flex min-h-[75svh] w-full items-center justify-center px-4 py-20 md:px-8">
        <div className="w-full text-center">
          <div className="relative mx-auto w-full select-none">
            <SplitWordStroke text="APERTURA" />
            <SplitWordFill text="APERTURA" />
          </div>

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
