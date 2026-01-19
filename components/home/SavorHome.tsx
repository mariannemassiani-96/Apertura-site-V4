"use client";

import HomeHero from "@/components/home/sections/HomeHero";
import StoryScroll from "@/components/home/sections/StoryScroll";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <main className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryScroll />
      <AperturaOutro />
    </main>
  );
}
