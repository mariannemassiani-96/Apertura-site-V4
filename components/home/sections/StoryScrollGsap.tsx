"use client";

import Image from "next/image";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StoryItem = {
  key: string;
  text: React.ReactNode; // TEXTE STRICT via <br/>
  mediaSrc: string;
  mediaAlt: string;
};

const STORY: StoryItem[] = [
  { key: "s1", text: <>DES OUVERTURES QUI FONT DU BIEN</>, mediaSrc: "/home/story/01.jpg", mediaAlt: "Collectif, lumière, chaleur" },
  {
    key: "s2",
    text: (
      <>
        De la matière brute <br />
        à la lumière dans les espaces
      </>
    ),
    mediaSrc: "/home/story/02.jpg",
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
    mediaSrc: "/home/story/03.jpg",
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
    mediaSrc: "/home/story/04.jpg",
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
    mediaSrc: "/home/story/05.jpg",
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
    mediaSrc: "/home/story/06a.jpg",
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
    mediaSrc: "/home/story/06b.jpg",
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
    mediaSrc: "/home/story/07.jpg",
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
    mediaSrc: "/home/story/08.jpg",
    mediaAlt: "Sensorialité, main, matière",
  },
  { key: "s9", text: <>L’avenir s’ouvre ici</>, mediaSrc: "/home/story/09.jpg", mediaAlt: "Ouverture finale, horizon" },
];

export default function StoryScrollGsap() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = STORY.length;
  const totalHeight = useMemo(() => `${count * 100}svh`, [count]);

  useLayoutEffect(() => {
    if (!wrapRef.current || !viewportRef.current) return;

    const ctx = gsap.context(() => {
      const wrap = wrapRef.current!;
      const viewport = viewportRef.current!;
      const layers = Array.from(viewport.querySelectorAll<HTMLElement>("[data-layer]"));
      const text = viewport.querySelector<HTMLElement>("[data-text]");

      // Init visuel : seule la 1ere image visible
      layers.forEach((el, i) => {
        gsap.set(el, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.02 });
      });
      if (text) gsap.set(text, { opacity: 1, y: 0 });

      // Driver "steps" : 1 écran = 1 index
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: false,
        onUpdate: (self) => {
          const idx = Math.min(count - 1, Math.max(0, Math.floor(self.progress * count)));
          setActiveIndex(idx);
        },
      });

      // Transitions sur changement d’index (via un trigger par step)
      // On crée une timeline par step pour “respirer” (pas de parallax continu)
      STORY.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: wrap,
          start: () => `top top-=${i * window.innerHeight}`,
          end: () => `top top-=${(i + 1) * window.innerHeight}`,
          onEnter: () => playTo(i),
          onEnterBack: () => playTo(i),
        });
      });

      function playTo(next: number) {
        const current = layers.findIndex((el) => Number(el.dataset.index) === next);

        // on anime tout : active = 1, les autres = 0
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

        if (text) {
          gsap.fromTo(
            text,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", overwrite: true }
          );
        }

        setActiveIndex(next);
      }
    }, wrapRef);

    return () => ctx.revert();
  }, [count]);

  const active = STORY[activeIndex];

  return (
    <section ref={wrapRef} className="relative w-full" style={{ height: totalHeight }}>
      <div ref={viewportRef} className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* MEDIA stack */}
        <div className="absolute inset-0">
          {STORY.map((item, idx) => (
            <div
              key={item.key}
              data-layer
              data-index={idx}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={item.mediaSrc}
                alt={item.mediaAlt}
                fill
                priority={idx <= 1}
                sizes="100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>

        {/* TEXTE (discret) */}
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
                    style={{ wid
