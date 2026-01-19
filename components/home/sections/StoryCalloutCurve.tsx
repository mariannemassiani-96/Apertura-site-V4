"use client";

import Image from "next/image";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { MOTION } from "@/components/home/utils/motion";

type StoryItem = {
  key: string;
  text: React.ReactNode; // TEXTE STRICT via <br/>
  mediaSrc: string;
  mediaAlt: string;
};

const STORY: StoryItem[] = [
  {
    key: "s1",
    text: <>DES OUVERTURES QUI FONT DU BIEN</>,
    mediaSrc: "/media/home/01.jpg",
    mediaAlt: "Collectif, lumière, chaleur",
  },
  {
    key: "s2",
    text: (
      <>
        De la matière brute <br />
        à la lumière dans les espaces
      </>
    ),
    mediaSrc: "/media/home/02.jpg",
    mediaAlt: "Matière brute et lumière",
  },
  {
    key: "s3",
    text: (
      <>
        Nous fabriquons des ouvertures pensées pour laisser entrer la lumière, <br />
        l’air, <br />
        et rendre les lieux plus agréables à vivre
      </>
    ),
    mediaSrc: "/media/home/03.jpg",
    mediaAlt: "Vie quotidienne collective",
  },
  {
    key: "s4",
    text: (
      <>
        Sans excès <br />
        sans gaspillage <br />
        sans promesses inutiles
      </>
    ),
    mediaSrc: "/media/home/04.jpg",
    mediaAlt: "Contre-rythme, presque vide",
  },
  {
    key: "s5",
    text: (
      <>
        Sans trajets superflus <br />
        sans production démesurée <br />
        sans oublier d’où viennent les choses
      </>
    ),
    mediaSrc: "/media/home/05.jpg",
    mediaAlt: "Nature, sol, origine",
  },
  {
    key: "s6a",
    text: (
      <>
        Nous imaginons des habitats plus justes <br />
        mieux conçus <br />
        faits pour durer
      </>
    ),
    mediaSrc: "/media/home/06a.jpg",
    mediaAlt: "Petite échelle",
  },
  {
    key: "s6b",
    text: (
      <>
        Nous imaginons des habitats plus justes <br />
        mieux conçus <br />
        faits pour durer
      </>
    ),
    mediaSrc: "/media/home/06b.jpg",
    mediaAlt: "Grande échelle",
  },
  {
    key: "s7",
    text: (
      <>
        Inspirés par le territoire <br />
        par le climat <br />
        par la manière dont on habite vraiment
      </>
    ),
    mediaSrc: "/media/home/07.jpg",
    mediaAlt: "Climat vécu",
  },
  {
    key: "s8",
    text: (
      <>
        Des matières réelles <br />
        une lumière vraie <br />
        un confort qui se ressent
      </>
    ),
    mediaSrc: "/media/home/08.jpg",
    mediaAlt: "Sensorialité, main, matière",
  },
  {
    key: "s9",
    text: <>L’avenir s’ouvre ici</>,
    mediaSrc: "/media/home/09.jpg",
    mediaAlt: "Ouverture finale, horizon",
  },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function StoryCalloutCurve() {
  const rootRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop(1024);

  const [activeIndex, setActiveIndex] = useState(0);
  const count = STORY.length;

  // desktop: un “moment” = 100svh
  const totalHeight = useMemo(() => `${count * 100}svh`, [count]);

  useLayoutEffect(() => {
    if (reduced) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    // -------- Desktop pinned “story callout”
    if (isDesktop) {
      if (!rootRef.current || !viewportRef.current) return;

      const ctx = gsap.context(() => {
        const viewport = viewportRef.current!;
        const layers = Array.from(viewport.querySelectorAll<HTMLElement>("[data-layer]"));
        const textEl = viewport.querySelector<HTMLElement>("[data-story-text]");
        const labelEl = viewport.querySelector<HTMLElement>("[data-story-label]");
        const path = viewport.querySelector<SVGPathElement>("[data-curve-path]");

        let current = 0;

        // init layers
        layers.forEach((el, i) => {
          gsap.set(el, {
            opacity: i === 0 ? 1 : 0,
            scale: i === 0 ? 1 : 1.02,
            willChange: "transform,opacity",
          });
        });

        if (textEl) gsap.set(textEl, { opacity: 1, y: 0, willChange: "transform,opacity" });
        if (labelEl) gsap.set(labelEl, { x: -44, opacity: 0.92, willChange: "transform,opacity" });

        // curve draw init
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 0.85,
            willChange: "stroke-dashoffset",
          });
        }

        const st = ScrollTrigger.create({
          trigger: rootRef.current!,
          start: "top top",
          end: "bottom bottom",
          // pas de scrub : on “step”
          onUpdate: (self) => {
            const next = clamp(Math.floor(self.progress * count), 0, count - 1);
            if (next === current) return;

            current = next;
            setActiveIndex(next);

            // image crossfade
            layers.forEach((layer) => {
              const isActive = Number(layer.dataset.index) === next;
              gsap.to(layer, {
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.02,
                duration: MOTION.fadeDur,
                ease: MOTION.easeOut,
                overwrite: true,
              });
            });

            // texte “glisse” + ré-entrée
            if (textEl) {
              gsap.fromTo(
                textEl,
                { opacity: 0, y: MOTION.yIn },
                { opacity: 1, y: 0, duration: 0.45, ease: MOTION.easeOut, overwrite: true }
              );
            }

            // label savor : micro drift horizontal
            if (labelEl) {
              gsap.fromTo(
                labelEl,
                { opacity: 0.9, x: -44 },
                { opacity: 1, x: 70, duration: 0.6, ease: "none", overwrite: true }
              );
            }

            // courbe : redessine légèrement à chaque step (petit reset + redraw)
            if (path) {
              const length = path.getTotalLength();
              gsap.set(path, { strokeDashoffset: length });
              gsap.to(path, { strokeDashoffset: 0, duration: 0.6, ease: "none", overwrite: true });
            }
          },
        });

        return () => st.kill();
      }, rootRef);

      return () => ctx.revert();
    }

    // -------- Mobile/tablet : stack (lecture libre)
    if (!mobileRef.current) return;

    const ctx = gsap.context(() => {
      const items = Array.from(mobileRef.current!.querySelectorAll<HTMLElement>("[data-m-item]"));

      items.forEach((item) => {
        const text = item.querySelector<HTMLElement>("[data-m-text]");
        const media = item.querySelector<HTMLElement>("[data-m-media]");

        if (media) gsap.set(media, { scale: 1.02, willChange: "transform" });
        if (text) gsap.set(text, { opacity: 0, y: MOTION.yIn, willChange: "transform,opacity" });

        ScrollTrigger.create({
          trigger: item,
          start: "top 75%",
          end: "bottom 40%",
          onEnter: () => {
            if (media) gsap.to(media, { scale: 1, duration: 0.9, ease: MOTION.easeOut, overwrite: true });
            if (text) gsap.to(text, { opacity: 1, y: 0, duration: 0.55, ease: MOTION.easeOut, overwrite: true });
          },
          onEnterBack: () => {
            if (media) gsap.to(media, { scale: 1, duration: 0.9, ease: MOTION.easeOut, overwrite: true });
            if (text) gsap.to(text, { opacity: 1, y: 0, duration: 0.55, ease: MOTION.easeOut, overwrite: true });
          },
        });
      });
    }, mobileRef);

    return () => ctx.revert();
  }, [count, isDesktop, reduced]);

  // -------- Mobile render
  if (!isDesktop) {
    return (
      <section className="relative w-full bg-graphite">
        <div ref={mobileRef} className="mx-auto w-full max-w-6xl px-5 py-14 md:px-10 md:py-20">
          <div className="space-y-10 md:space-y-14">
            {STORY.map((item) => (
              <article key={item.key} data-m-item className="relative overflow-hidden rounded-2xl bg-black/10">
                <div data-m-media className="relative aspect-[4/5] w-full md:aspect-[16/9]">
                  <Image src={item.mediaSrc} alt={item.mediaAlt} fill sizes="100vw" className="object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-black/10" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                <div className="absolute inset-0 flex items-end">
                  <div className="w-full p-6 md:p-8">
                    <div data-m-text className="max-w-[34rem]">
                      <div className="text-ivoire/92 text-[18px] leading-[1.28] tracking-[-0.01em] md:text-[22px]">
                        {item.text}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sr-only">{item.text}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // -------- Desktop render
  const active = STORY[activeIndex];

  return (
    <section ref={rootRef} className="relative w-full bg-graphite" style={{ height: totalHeight }}>
      <div ref={viewportRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* MEDIA plein écran */}
        <div className="absolute inset-0">
          {STORY.map((item, idx) => (
            <div key={item.key} data-layer data-index={idx} className="absolute inset-0">
              <Image src={item.mediaSrc} alt={item.mediaAlt} fill priority={idx <= 1} sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/45 md:bg-black/35" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(194,122,74,0.10),transparent_55%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/55 via-black/18 to-transparent" />
            </div>
          ))}
        </div>

        {/* CALLOUT CURVE + TEXT */}
        <div className="relative mx-auto flex h-[100svh] max-w-6xl flex-col justify-between px-4 py-20 md:px-8 lg:py-28">
          {/* Label + ligne (savor) */}
          <div data-story-label className="mx-auto flex w-full max-w-3xl items-center gap-6 text-sm text-ivoire/85">
            <span className="whitespace-nowrap">Apertura</span>
            <span className="h-px flex-1 bg-ivoire/30" />
            <span className="whitespace-nowrap">di Corsica</span>
          </div>

          {/* Courbe */}
          <div className="relative">
            <svg className="h-[48svh] w-full" viewBox="0 0 1200 520" fill="none" aria-hidden="true">
              <path
                data-curve-path
                d="M240 60 C 520 90, 460 370, 720 400 C 910 420, 980 340, 1040 300"
                stroke="rgba(244,247,249,0.62)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Texte à droite (exactement ton texte actif) */}
            <div className="pointer-events-none absolute bottom-12 right-0 max-w-sm text-left">
              <div data-story-text className="text-ivoire/92 text-[18px] leading-[1.3] md:text-[22px]">
                {active.text}
              </div>

              {/* Progress discret */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-[2px] w-24 overflow-hidden rounded bg-ivoire/15">
                  <div
                    className="h-full bg-ivoire/70"
                    style={{ width: `${((activeIndex + 1) / count) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] tracking-[0.2em] text-ivoire/55">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accessibilité */}
        <div className="sr-only">
          {STORY.map((item) => (
            <div key={`sr-${item.key}`}>{item.text}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
