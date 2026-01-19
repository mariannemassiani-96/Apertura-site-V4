"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { siteContent } from "@/lib/content";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { MOTION } from "@/components/home/utils/motion";

export default function FloatingMedia() {
  const rootRef = useRef<HTMLElement | null>(null);
  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  const images = siteContent.home.rail.images as string[];
  const alts = siteContent.home.rail.alts as string[];

  const picks = useMemo(() => {
    const safe = (i: number) => ({
      src: images?.[i] ?? "/media/home/rail/01.jpg",
      alt: alts?.[i] ?? "Image Apertura di Corsica",
    });

    // 3 images (tu peux changer les indices si tu veux une sélection plus “macro”)
    return [safe(0), safe(1), safe(2)];
  }, [images, alts]);

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
      const title = root.querySelector<HTMLElement>("[data-float-title]");

      if (!a || !b || !c) return;

      gsap.set([a, b, c], { willChange: "transform" });
      if (title) gsap.set(title, { opacity: 0, y: MOTION.yIn, willChange: "transform,opacity" });

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

      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.1);

      // Trajectoires sobres (Savor moderne)
      tl.fromTo(a, { xPercent: -10, yPercent: 8, scale: 1.02 }, { xPercent: 6, yPercent: -4, scale: 1, ease: "none" }, 0);
      tl.fromTo(b, { xPercent: 10, yPercent: -6, scale: 1.03 }, { xPercent: -6, yPercent: 5, scale: 1, ease: "none" }, 0);
      tl.fromTo(c, { xPercent: -6, yPercent: -10, scale: 1.02 }, { xPercent: 10, yPercent: 6, scale: 1, ease: "none" }, 0.02);
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite">
      <div className="mx-auto min-h-[92svh] max-w-6xl px-4 py-20 md:px-8 lg:py-28">
        <div className="mb-10 max-w-xl">
          <p className="text-xs tracking-[0.22em] text-ivoire/60">IMAGES</p>
          <h2 data-float-title className="mt-4 text-2xl font-medium leading-tight md:text-4xl">
            Une matière qui bouge. Une lumière qui glisse.
          </h2>
        </div>

        <div className="relative h-[70svh] overflow-hidden rounded-3xl border border-ivoire/10 bg-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,247,249,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />

          <div data-float-a className="absolute left-[6%] top-[10%] h-[42%] w-[34%] overflow-hidden rounded-2xl border border-ivoire/10">
            <Image src={picks[0].src} alt={picks[0].alt} fill className="object-cover" sizes="40vw" />
          </div>

          <div data-float-b className="absolute right-[6%] top-[18%] h-[46%] w-[38%] overflow-hidden rounded-2xl border border-ivoire/10">
            <Image src={picks[1].src} alt={picks[1].alt} fill className="object-cover" sizes="40vw" />
          </div>

          <div data-float-c className="absolute left-[22%] bottom-[10%] h-[38%] w-[42%] overflow-hidden rounded-2xl border border-ivoire/10">
            <Image src={picks[2].src} alt={picks[2].alt} fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
