"use client";

import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

type StoryItem = {
  key: string;
  text: React.ReactNode; // texte strict (avec <br/>)
  mediaSrc: string;
  mediaAlt: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const STORY: StoryItem[] = [
  {
    key: "s1",
    text: <>DES OUVERTURES QUI FONT DU BIEN</>,
    mediaSrc: "/home/story/01.jpg",
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
  {
    key: "s9",
    text: <>L’avenir s’ouvre ici</>,
    mediaSrc: "/home/story/09.jpg",
    mediaAlt: "Ouverture finale, horizon",
  },
];

export default function StoryScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = STORY.length;
  const totalHeight = useMemo(() => `${count * 100}svh`, [count]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = clamp(Math.floor(p * count), 0, count - 1);
    setActiveIndex(idx);
  });

  const active = STORY[activeIndex];

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: totalHeight }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Media stack */}
        <div className="absolute inset-0">
          {STORY.map((item, idx) => {
            const isActive = idx === activeIndex;

            return (
              <motion.div
                key={item.key}
                className="absolute inset-0 will-change-transform"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 1.02 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={item.mediaSrc}
                  alt={item.mediaAlt}
                  fill
                  priority={idx <= 1}
                  sizes="100vw"
                  className="object-cover"
                />
                {/* voile très léger = cohérence, pas "beige" */}
                <div className="pointer-events-none absolute inset-0 bg-black/10" />
              </motion.div>
            );
          })}
        </div>

        {/* Text overlay */}
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="w-full bg-gradient-to-t from-black/65 via-black/10 to-transparent">
            <div className="mx-auto w-full max-w-6xl px-5 pb-10 md:px-10 md:pb-14">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-[34rem]"
                >
                  <div className="text-ivoire/90">
                    <div className="text-[20px] leading-[1.25] tracking-[-0.01em] md:text-[26px]">
                      {active.text}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress discret */}
              <div className="mt-5 flex items-center gap-3">
                <div className="h-[2px] w-24 overflow-hidden rounded bg-ivoire/15">
                  <motion.div
                    className="h-full w-full bg-ivoire/70"
                    initial={false}
                    animate={{ x: `${(activeIndex / Math.max(1, count - 1)) * 100 - 100}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
