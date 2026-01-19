"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryScrollGsap from "@/components/home/sections/StoryScrollGsap";
import CalloutCurveMedia from "@/components/home/sections/CalloutCurveMedia";
import FloatingMedia from "@/components/home/sections/FloatingMedia";
import HomeRail from "@/components/home/sections/HomeRail";
import PinnedSteps from "@/components/home/sections/PinnedSteps";
import ShrinkTransition from "@/components/home/sections/ShrinkTransition";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <div className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryScrollGsap />

      {/* Savor callout (media plein écran + courbe + texte qui glisse) */}
      <CalloutCurveMedia mediaType="image" imageSrc="/media/home/02.jpg" />

      {/* Images flottantes (3) */}
      <FloatingMedia />

      {/* Respiration galerie */}
      <HomeRail />

      <PinnedSteps />
      <ShrinkTransition />
      <AperturaOutro />
    </div>
  );
}
