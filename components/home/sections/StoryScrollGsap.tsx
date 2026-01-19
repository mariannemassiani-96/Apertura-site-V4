"use client";

import Image from "next/image";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export default function StoryScrollGsap() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const mobileWrapRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop(1024);

  const count = STORY.length;

  // Desktop: scroll “chapitré” (1 step = 100svh)
  const totalHeight = useMemo(() => `${count * 100}svh`, [count]);

  useLayoutEffect(() => {
    if (reduced) return;

    ensureGsap();
    gsap.registerPlugin(ScrollTrigger);

    // --- DESKTOP: sticky + steps crossfade
    if (isDesktop) {
      if (!wrapRef.current || !viewportRef.current) return;

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

        if (textEl) gsap.set(textEl, { opacity: 1, y: 0, willChange: "transform,opacity" });

        const st = ScrollTrigger.create({
          trigger: wrapRef.current!,
          start: "top top",
          end: "bottom bottom",
          // pas de scrub (on “step”)
          onUpdate: (self) => {
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
    }

    // --- MOBILE/TABLET: stack (pas de sticky, pas de steps)
    if (!mobileWrapRef.current) return;

    const ctx = gsap.context(() => {
      const items = Array.from(
        mobileWrapRef.current!.querySelectorAll<HTMLElement>("[data-m-item]")
      );

      items.forEach((item) => {
        const text = item.querySelector<HTMLElement>("[data-m-text]");
        const media = item.querySelector<HTMLElement>("[data-m-media]");

        // état initial sobre
        if (media) gsap.set(media, { opacity: 1, scale: 1.02, willChange: "transform" });
        if (text) gsap.set(text, { opacity: 0, y: 10, willChange: "transform,opacity" });

        ScrollTrigger.create({
          trigger: item,
          start: "top 75%",
          end: "bottom 40%",
          onEnter: () => {
            if (media) gsap.to(media, { scale: 1, duration: 0.9, ease: "power3.out", overwrite: true });
            if (text) gsap.to(text, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", overwrite: true });
          },
          onEnterBack: () => {
            if (media) gsap.to(media, { scale: 1, duration: 0.9, ease: "power3.out", overwrite: true });
            if (text) gsap.to(text, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", overwrite: true });
          },
          // pas de scrub, pas de pin
        });
      });
    }, mobileWrapRef);

    return () => ctx.revert();
  }, [count, reduced, isDesktop]);

  // ---------------- RENDER ----------------

  // MOBILE/TABLET STACK
  if (!isDesktop) {
    return (
      <section className="relative w-full">
        <div ref={mobileWrapRef} className="mx-auto w-full max-w-6xl px-5 py-14 md:px-10 md:py-20">
          <div className="space-y-10 md:space-y-14">
            {STORY.map((item) => (
              <article
                key={item.key}
                data-m-item
                className="relative overflow-hidden rounded-2xl bg-black/10"
              >
                <div data-m-media className="relative aspect-[4/5] w-full md:aspect-[16/9]">
                  <Image
                    src={item.mediaSrc}
                    alt={item.mediaAlt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={item.key === "s1" || item.key === "s2"}
                  />
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

  // DESKTOP STICKY STEP
  const active = STORY[activeIndex];

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: totalHeight }}>
      {/* viewport sticky */}
      <div ref={viewportRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* MEDIA stack */}
        <div className="absolute inset-0">
          {STORY.map((item, idx) => (
            <div key={item.key} data-layer data-index={idx} className="absolute inset-0">
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
