"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryScrollGsap from "@/components/home/sections/StoryScrollGsap";
import HomeRail from "@/components/home/sections/HomeRail";
import PinnedSteps from "@/components/home/sections/PinnedSteps";
import ShrinkTransition from "@/components/home/sections/ShrinkTransition";
import FloatingImages from "@/components/home/sections/FloatingImages";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <div className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryScrollGsap />

      {/* Respiration (choisis 1 des 2, ou garde les 2 mais espace davantage) */}
      <HomeRail />
      {/* ou */}
      {/* <FloatingImages /> */}

      <PinnedSteps />
      <ShrinkTransition />
      <AperturaOutro />
    </div>
  );
}
