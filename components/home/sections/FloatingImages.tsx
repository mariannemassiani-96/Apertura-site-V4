"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";

export default function FloatingImages() {
  const rootRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop(1024);

  const images = useMemo(
    () => [
      { src: "/media/home/rail/06.jpg", alt: "Ouverture et lumière" },
      { src: "/media/home/rail/07.jpg", alt: "Détail de finition" },
      { src: "/media/home/rail/08.jpg", alt: "Menuiserie en situation" },
      { src: "/media/home/rail/09.jpg", alt: "Atelier et matière" },
      { src: "/media/home/rail/10.jpg", alt: "Intérieur et transparence" },
    ],
    []
  );

  useEffect(() => {
    if (reduced || !isDesktop || !rootRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-stack-image]");

      // micro-parallax vertical uniquement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      items.forEach((el, i) => {
        const intensity = (i % 2 === 0 ? -1 : 1) * (6 + i * 2);

        tl.fromTo(
          el,
          { y: 0 },
          { y: intensity, ease: "none" },
          0
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, isDesktop]);

  return (
    <section
      ref={rootRef as any}
      className="relative bg-graphite-soft overflow-hidden"
    >
      {/* Texte */}
      <div className="mx-auto max-w-6xl px-4 pt-24 md:px-8">
        <div className="max-w-xl">
          <p className="text-xs tracking-[0.22em] text-ivoire/60">RÉCIT</p>
          <p className="mt-4 whitespace-pre-line text-2xl font-medium leading-snug text-ivoire md:text-3xl">
            Concevoir une ouverture,
            {"\n"}c’est orchestrer la lumière,
            {"\n"}le confort et le temps.
          </p>
        </div>
      </div>

      {/* Colonne d’images */}
      <div className="relative mx-auto mt-20 max-w-6xl px-4 pb-32 md:px-8">
        <div className="relative">
          {images.map((img, i) => (
            <div
              key={img.src}
              data-stack-image
              className={[
                "relative mb-[-12vh] w-[78%] overflow-hidden rounded-xl",
                i % 2 === 0 ? "ml-0" : "ml-auto",
              ].join(" ")}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
