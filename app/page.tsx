import Image from "next/image";
import { siteContent, labels } from "@/lib/content";
import { Section } from "@/components/Section";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.home.title,
  description: siteContent.pageMeta.home.description,
  path: "/",
});

export default function HomePage() {
  const { home } = siteContent;

  return (
    <div className="bg-graphite">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
        ])}
      />
      <Section className="relative h-[90vh] w-full overflow-hidden md:h-screen">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={home.hero.videoPoster}
          aria-label={home.hero.videoAlt}
        >
          <source src={home.hero.videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-graphite/60 md:bg-graphite/50" />
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-5xl px-5 pb-16 md:pb-24">
            <h1 className="section-heading max-w-xl">
              {home.hero.heading}
            </h1>
            <p className="mt-4 max-w-lg text-sm uppercase tracking-wide text-ivoire/70">
              {home.hero.subheading}
            </p>
            <div className="mt-8 text-xs uppercase tracking-[0.3em] text-ivoire/60">
              {home.hero.scrollHint}
            </div>
          </div>
        </div>
      </Section>

      <Section className="relative min-h-screen bg-graphite py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="section-title">{home.labels.narration}</div>
            <h2 className="section-heading">{home.title}</h2>
            <p className="section-body max-w-lg">
              {home.story[0].text}
            </p>
          </div>
          <div className="relative h-[60vh] overflow-hidden rounded-3xl md:h-[70vh]">
            <Image
              src={home.story[0].image}
              alt={home.story[0].alt}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="mx-auto mt-12 grid w-full max-w-6xl gap-6 px-5 md:grid-cols-3">
          {home.story.slice(1).map((panel) => (
            <div key={panel.title} className="rounded-2xl border border-ivoire/10 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-ivoire/50">{panel.title}</div>
              <p className="mt-4 text-sm text-ivoire/70 whitespace-pre-line">{panel.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="relative bg-graphite py-16 md:py-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-center">
          <div className="relative h-[70vh] w-full overflow-hidden rounded-3xl md:h-[60vh] md:w-1/2">
            <Image
              src={home.shrink.image}
              alt={home.shrink.alt}
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <div className="section-title">{home.labels.approach}</div>
            <p className="section-heading whitespace-pre-line">{home.shrink.text}</p>
          </div>
        </div>
      </Section>

      <Section className="relative bg-graphite py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="section-title">{home.labels.orchestration}</div>
          <h2 className="section-heading whitespace-pre-line">{home.floating.text}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {home.floating.images.map((image, index) => (
              <div
                key={image}
                className="relative h-64 overflow-hidden rounded-2xl"
              >
                <Image
                  src={image}
                  alt={home.floating.alts[index]}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="relative bg-graphite py-16 md:py-24">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-5">
          <div className="text-center text-xs uppercase tracking-[0.6em] text-ivoire/50">
            {siteContent.footer.signature}
          </div>
        </div>
      </Section>
    </div>
  );
}
