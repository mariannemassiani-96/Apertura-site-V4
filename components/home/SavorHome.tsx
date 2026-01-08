"use client";

import HomeRail from "@/components/home/sections/HomeRail";
import PinnedSteps from "@/components/home/sections/PinnedSteps";
import AperturaOutro from "@/components/home/sections/AperturaOutro";

export default function SavorHome() {
  return (
    <main className="bg-graphite text-ivoire">
      {/* Rail savor-like */}
      <HomeRail />

      {/* Steps pinned (desktop only) / stacked (mobile) */}
      <PinnedSteps />

      {/* Outro APERTURA */}
      <AperturaOutro />
    </main>
  );
}
