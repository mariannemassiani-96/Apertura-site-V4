"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (prefersReduced || isIOS) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // ✅ Lenis -> ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // ✅ Utiliser le ticker GSAP (meilleur que double RAF)
    const tick = (time: number) => {
      lenis.raf(time * 1000); // ticker = seconds, lenis = ms
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ✅ Refresh après init
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
