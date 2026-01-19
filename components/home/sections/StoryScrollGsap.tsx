"use client";

import Image from "next/image";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StoryItem = {
  key: string;
  text: React.ReactNode; // TEXTE STRICT via <br/>
  mediaSrc: string;
  mediaAlt: string;
};

const STORY: StoryItem[] = [
  // 1
  {
    key: "s1",
    text: <>DES OUVERTURES QUI FONT DU BIEN</>,
    mediaSrc: "/home/01.jpg",
    mediaAlt: "Collectif, lumière, chaleur",
  },
  // 2
  {
    key: "s2",
    text: (
      <>
        De la matière brute <br />
        à la lumière dans les espaces
      </>
    ),
    mediaSrc: "/home/02.jpg",
    mediaAlt: "Matière brute et lumière",
  },
  // 3
  {
    key: "s3",
    text: (
      <>
        Nous fabriquons des ouvertures pensées pour laisser entrer la lumière, <br />
        l’air, <br />
        et rendre les lieux plus agréables à vivre
      </>
    ),
    mediaSrc: "/home/03.jpg",
    mediaAlt: "Vie quotidienne collective",
  },
  // 4
  {
    key: "s4",
    text: (
      <>
        Sans excès <br />
        sans gaspillage <br />
        sans promesses inutiles
      </>
    ),
    mediaSrc: "/home/04.jpg",
    mediaAlt: "Contre-rythme, presque vide",
  },
  // 5
  {
    key: "s5",
    text: (
      <>
        Sans trajets superflus <br />
        sans production démesurée <br />
        sans oublier d’où viennent les choses
      </>
    ),
    mediaSrc: "/home/05.jpg",
    mediaAlt: "Nature, sol, origine",
  },
  // 6A (petite échelle)
  {
    key: "s6a",
    text: (
      <>
        Nous imaginons des habitats plus justes <br />
        mieux conçus <br />
        faits pour durer
      </>
    ),
    mediaSrc: "/home/06a.jpg",
    mediaAlt: "Petite échelle",
  },
  // 6B (grande échelle)
  {
    key: "s6b",
    text: (
      <>
        Nous imaginons des habitats plus justes <br />
        mieux conçus <br />
        faits pour durer
      </>
    ),
    mediaSrc: "/home/06b.jpg",
    mediaAlt: "Grande échelle",
  },
  // 7
  {
    key: "s7",
    text: (
      <>
        Inspirés par le territoire <br />
        par le climat <br />
        par la manière dont on habite vraiment
      </>
    ),
    mediaSrc: "/home/07.jpg",
    mediaAlt: "Climat vécu",
  },
  // 8
  {
    key: "s8",
    text: (
      <>
        Des matières réelles <br />
        une lumière vraie <br />
        un confort qui se ressent
      </>
    ),
    mediaSrc: "/home/08.jpg",
    mediaAlt: "Sensorialité, main, matière",
  },
  // 9
  {
    key: "s9",
    text: <>L’avenir s’ouvre ici</>,
    mediaSrc: "/home/09.jpg",
    mediaAlt: "Ouverture finale, horizon",
  },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export default function StoryScrollGsap() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  const count = STORY.length;
  const totalHeight = useMemo(() => `${count * 100}svh`, [count]);

  useLayoutEffect(() => {
    if (reduced) return;
    if (!wrapRef.current || !viewportRef.current) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const viewport = viewportRef.current!;
      const layers = Array.from(viewport.querySelectorAll<HTMLElement>("[data-layer]"));
      const textEl = viewport.querySelector<HTMLElement>("[data-text]");

      let current = 0;

      // Init: première image visible
      layers.forEach((el, i) => {
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 1.02,
          willChange: "transform,opacity",
        });
      });
      if (textEl) gsap.set(textEl, { opacity: 1, y: 0 });

      const st = ScrollTrigger.create({
        trigger: wrapRef.current!,
        start: "top top",
        end: "bottom bottom",
        // pas de scrub (on “step”)
        onUpdate: (self) => {
          // progress ∈ [0..1], on convertit en index
          const next = clamp(Math.floor(self.progress * count), 0, count - 1);
          if (next === current) return;

          current = next;
          setActiveIndex(next);

          // Crossfade + micro-scale
          layers.forEach((layer) => {
            const isActive = Number(layer.dataset.index) === next;
            gsap.to(layer, {
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1 : 1.02,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
            });
          });

          // Texte: entrée douce, pas de blur (iOS friendly)
          if (textEl) {
            gsap.fromTo(
              textEl,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", overwrite: true }
            );
          }
        },
      });

      return () => st.kill();
    }, wrapRef);

    return () => ctx.revert();
  }, [count, reduced]);

  const active = STORY[activeIndex];

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: totalHeight }}>
      {/* viewport sticky */}
      <div ref={viewportRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* MEDIA stack */}
        <div className="absolute inset-0">
          {STORY.map((item, idx) => (
            <div
              key={item.key}
              data-layer
              data-index={idx}
              className="absolute inset-0"
            >
              <Image
                src={item.mediaSrc}
                alt={item.mediaAlt}
                fill
                priority={idx <= 1}
                sizes="100vw"
                className="object-cover"
              />
              {/* voile ultra léger */}
              <div className="pointer-events-none absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>

        {/* TEXTE overlay discret */}
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="w-full bg-gradient-to-t from-black/65 via-black/10 to-transparent">
            <div className="mx-auto w-full max-w-6xl px-5 pb-10 md:px-10 md:pb-14">
              <div data-text className="max-w-[34rem]">
                <div className="text-ivoire/90 text-[20px] leading-[1.25] tracking-[-0.01em] md:text-[26px]">
                  {active.text}
                </div>
              </div>

              {/* Progress discret */}
              <div className="mt-5 flex items-center gap-3">
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
