"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { MOTION } from "@/components/home/utils/motion";

type Props = {
  imageSrc?: string;
  imageAlt?: string;
};

export default function CalloutCurveMedia({
  imageSrc = "/media/home/02.jpg",
  imageAlt = "",
}: Props) {
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
      const path = root.querySelector<SVGPathElement>("[data-curve-path]");
      const label = root.querySelector<HTMLElement>("[data-curve-label]");
      const copy = root.querySelector<HTMLElement>("[data-curve-copy]");
      const copy2 = root.querySelector<HTMLElement>("[data-curve-copy-2]");

      if (!path || !label || !copy) return;

      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.85,
        willChange: "stroke-dashoffset",
      });

      gsap.set(label, { x: -46, opacity: 0.92, willChange: "transform,opacity" });
      gsap.set(copy, { x: 18, y: MOTION.yIn, opacity: 0, willChange: "transform,opacity" });
      if (copy2) gsap.set(copy2, { x: 18, y: MOTION.yIn, opacity: 0, willChange: "transform,opacity" });

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

      // Courbe qui se “dessine”
      tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0);

      // Label qui glisse (feel savor)
      tl.to(label, { x: 70, opacity: 1, ease: "none" }, 0.05);

      // Copy à droite qui arrive
      tl.to(copy, { opacity: 1, x: 0, y: 0, duration: 0.25, ease: "none" }, 0.22);
      if (copy2) tl.to(copy2, { opacity: 1, x: 0, y: 0, duration: 0.25, ease: "none" }, 0.32);

      // micro “drift” global (ultra discret)
      tl.to("[data-curve-float]", { y: -8, ease: "none" }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite">
      {/* MEDIA plein écran */}
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />

        {/* traitement savor-like (sobre) */}
        <div className="absolute inset-0 bg-black/45 md:bg-black/35" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/55 via-black/18 to-transparent" />
      </div>

      {/* CONTENU */}
      <div className="relative mx-auto min-h-[92svh] max-w-6xl px-4 py-20 md:px-8 lg:py-28">
        <div data-curve-float className="relative">
          {/* Label type savor (tu peux remplacer par tes textes exacts) */}
          <div
            data-curve-label
            className="relative z-10 mx-auto flex max-w-3xl items-center gap-6 text-sm text-ivoire/85"
          >
            <span className="whitespace-nowrap">De la matière brute</span>
            <span className="h-px flex-1 bg-ivoire/30" />
            <span className="whitespace-nowrap">à la lumière</span>
          </div>

          {/* Courbe */}
          <div className="relative mt-10">
            <svg
              className="h-[48svh] w-full"
              viewBox="0 0 1200 520"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                data-curve-path
                d="M240 60 C 520 90, 460 370, 720 400 C 910 420, 980 340, 1040 300"
                stroke="rgba(244,247,249,0.62)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Copy à droite (mets tes textes existants) */}
            <div className="pointer-events-none absolute bottom-12 right-0 max-w-sm text-left">
              <div data-curve-copy className="text-ivoire/92 text-[18px] leading-[1.3] md:text-[22px]">
                {/* Remplace par ton texte existant */}
                Nous fabriquons des ouvertures pensées pour laisser entrer la lumière.
              </div>

              <div data-curve-copy-2 className="mt-3 text-ivoire/70 text-[14px] leading-relaxed md:text-[16px]">
                {/* Optionnel : supprime ce bloc si tu ne veux qu’une seule phrase */}
                Sans effets inutiles. Juste le rythme.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
