import StoryCalloutCurve from "@/components/home/sections/StoryCalloutCurve";

export default function SavorHome() {
  return (
    <div className="bg-graphite text-ivoire">
      <HomeHero />
      <StoryCalloutCurve />
      {/* puis la suite */}
      <HomeRail />
      <PinnedSteps />
      <ShrinkTransition />
      <AperturaOutro />
    </div>
  );
}
