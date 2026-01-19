"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryCalloutCurve from "@/components/home/sections/StoryCalloutCurve";
import HomeRail from "@/components/home/sections/HomeRail";
import PinnedSteps from "@/components/home/sections/PinnedSteps";
import ShrinkTransition from "@/components/home/sections/ShrinkTransition";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <div className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryCalloutCurve />
      <HomeRail />
      <PinnedSteps />
      <ShrinkTransition />
      <AperturaOutro />
    </div>
  );
}
