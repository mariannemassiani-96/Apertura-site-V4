"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { MOTION } from "@/components/home/utils/motion";

export default function FloatingMedia() {
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
      const a = root.querySelector<HTMLElement>("[data-float-a]");
      const b = root.querySelector<HTMLElement>("[data-float-b]");
      const c = root.querySelector<HTMLElement>("[data-float-c]");

      if (!a || !b || !c) return;

      gsap.set([a, b, c], { willChange: "transform" });

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

      tl.fromTo(a, { xPercent: -10, yPercent: 8, scale: 1.02 }, { xPercent: 6, yPercent: -4, scale: 1, ease: "none" }, 0);
      tl.fromTo(b, { xPercent: 10, yPercent: -6, scale: 1.03 }, { xPercent: -6, yPercent: 5, scale: 1, ease: "none" }, 0);
      tl.fromTo(c, { xPercent: -6, yPercent: -10, scale: 1.02 }, { xPercent: 10, yPercent: 6, scale: 1, ease: "none" }, 0.02);
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite">
      <div className="mx-auto min-h-[92svh] max-w-6xl px-4 py-20 md:px-8 lg:py-28">
        <div className="relative h-[70svh] overflow-hidden rounded-3xl border border-ivoire/10 bg-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,247,249,0.06),transparent_60%)]" />

          <div data-float-a className="absolute left-[6%] top-[10%] h-[42%] w-[34%] overflow-hidden rounded-2xl border border-ivoire/10">
            <Image src="/media/home/rail/01.jpg" alt="Apertura" fill className="object-cover" sizes="40vw" />
          </div>

          <div data-float-b className="absolute right-[6%] top-[18%] h-[46%] w-[38%] overflow-hidden rounded-2xl border border-ivoire/10">
            <Image src="/media/home/rail/02.jpg" alt="Apertura" fill className="object-cover" sizes="40vw" />
          </div>

          <div data-float-c className="absolute left-[22%] bottom-[10%] h-[38%] w-[42%] overflow-hidden rounded-2xl border border-ivoire/10">
            <Image src="/media/home/rail/03.jpg" alt="Apertura" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
