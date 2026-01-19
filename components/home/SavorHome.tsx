"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryScrollGsap from "@/components/home/sections/StoryScrollGsap";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <div className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryScrollGsap />
      <AperturaOutro />
    </div>
  );
}
