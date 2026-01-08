"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // ⚠️ smoothTouch n'existe pas sur certaines versions/types de Lenis
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
