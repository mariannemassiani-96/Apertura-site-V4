"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function FloatingImages() {
  const rootRef = useRef<HTMLElement | null>(null);
  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  const imgs = useMemo(
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
    if (reduced) return;
    if (!isDesktop) return;
    if (!rootRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-float]");

      gsap.set(items, { opacity: 0.96 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current!,
          start: "top top",
          end: "+=1200",
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
        },
      });

      items.forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        tl.fromTo(
          el,
          { xPercent: 0, yPercent: 0, scale: 1 },
          { xPercent: dir * (6 + i * 2), yPercent: -(6 + i * 2), scale: 1.04, ease: "none" },
          0
        );
      });

      tl.fromTo(
        "[data-float-text]",
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.38, ease: "none" },
        0.05
      );
    }, rootRef);

    return () => ctx.revert();
  }, [isDesktop, reduced]);

  return (
    <section ref={rootRef as any} className="relative bg-graphite-soft">
      {/* Halo chaud discret (cohérence home) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.08),transparent_55%)]" />

      <div className="relative mx-auto min-h-[100svh] max-w-6xl px-4 py-16 md:px-8 lg:py-24">
        <div className="relative rounded-2xl border border-ivoire/12 bg-black/10 p-6 md:p-8 lg:min-h-[80vh]">
          {/* Petite profondeur (sans assombrir) */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.10),transparent_60%)]" />

          <div data-float-text className="relative z-10 max-w-xl">
            <p className="text-xs tracking-[0.22em] text-ivoire/60">RÉCIT</p>
            <p className="mt-4 whitespace-pre-line text-2xl font-medium leading-snug text-ivoire md:text-3xl">
              Concevoir une ouverture,
              {"\n"}c’est orchestrer la lumière,
              {"\n"}le confort et le temps.
            </p>
          </div>

          {/* Desktop “floating” stage */}
          <div className="relative mt-10 hidden min-h-[54vh] lg:block">
            {imgs.map((im, i) => (
              <div
                key={im.src}
                data-float
                className={[
                  "absolute overflow-hidden rounded-2xl border border-ivoire/12 bg-black/10",
                  i === 0 ? "left-[6%] top-[8%] h-[34vh] w-[22vw]" : "",
                  i === 1 ? "right-[8%] top-[12%] h-[28vh] w-[20vw]" : "",
                  i === 2 ? "left-[22%] bottom-[10%] h-[30vh] w-[24vw]" : "",
                  i === 3 ? "right-[20%] bottom-[14%] h-[26vh] w-[18vw]" : "",
                  i === 4 ? "left-[46%] top-[34%] h-[22vh] w-[18vw]" : "",
                ].join(" ")}
              >
                <Image src={im.src} alt={im.alt} fill sizes="25vw" className="object-cover" />
                {/* Overlay plus léger */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/8 to-transparent" />
              </div>
            ))}
          </div>

          {/* Mobile: pile verticale premium */}
          <div className="mt-10 grid gap-4 lg:hidden">
            {imgs.slice(0, 4).map((im) => (
              <div
                key={`m-${im.src}`}
                className="relative h-[52vh] overflow-hidden rounded-2xl border border-ivoire/12 bg-black/10"
              >
                <Image src={im.src} alt={im.alt} fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-black/22" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
