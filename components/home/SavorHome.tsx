"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryPanels from "@/components/home/sections/StoryPanels";
import ShrinkTransition from "@/components/home/sections/ShrinkTransition";
import FloatingImages from "@/components/home/sections/FloatingImages";
import HomeRail from "@/components/home/sections/HomeRail";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <main className="bg-graphite text-ivoire">
      {/* 1) HERO fullscreen (vertical, savor-like) */}
      <HomeHero />

      {/* 2) STORY fullscreen (4 tableaux) */}
      <StoryPanels />

      {/* 3) SHRINK transition */}
      <ShrinkTransition />

      {/* 4) FLOATING images (desktop), stack mobile */}
      <FloatingImages />

      {/* 5) (Option) Rail = “grappe / galerie” dans le flux */}
      <HomeRail />

      {/* 6) OUTRO APERTURA */}
      <AperturaOutro />
    </main>
  );
}
