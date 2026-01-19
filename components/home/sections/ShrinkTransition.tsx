"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/components/home/utils/gsap";
import { useIsDesktop } from "@/components/home/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/components/home/hooks/usePrefersReducedMotion";

export default function ShrinkTransition() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop(1024);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!isDesktop) return;
    if (!rootRef.current || !cardRef.current) return;

    ensureGsap();

    const ctx = gsap.context(() => {
      const root = rootRef.current!;
      const card = cardRef.current!;

      // init (évite flash / optimise)
      gsap.set(card, { willChange: "transform,border-radius" });
      gsap.set("[data-shrink-text]", { opacity: 0, y: 10, willChange: "transform,opacity" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=130%", // adaptatif (au lieu de 900px)
          scrub: 0.85,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Geste unique : “cadre qui se resserre”
      tl.fromTo(
        card,
        { scale: 1, borderRadius: 0, y: 0 },
        { scale: 0.72, borderRadius: 24, y: -10, ease: "none" },
        0
      );

      // Text
