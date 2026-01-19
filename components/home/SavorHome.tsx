"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryScrollGsap from "@/components/home/sections/StoryScrollGsap";

export default function SavorHome() {
  return (
    <div className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryScrollGsap />
    </div>
  );
}
