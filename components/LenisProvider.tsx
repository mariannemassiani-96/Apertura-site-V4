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

    // ✅ coupe Lenis sur iOS + respecte reduced motion
    if (prefersReduced || isIOS) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    // 1) Lenis -> ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 2) GSAP ticker pilote Lenis (évite double RAF et colle aux ScrollTriggers)
    const tick = (time: number) => {
      // gsap ticker est en secondes, lenis en ms
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 3) refresh après init
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
