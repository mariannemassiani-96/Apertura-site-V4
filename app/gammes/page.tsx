import Image from "next/image";
import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.gammes.title,
  description: siteContent.pageMeta.gammes.description,
  path: "/gammes",
});

export default function GammesPage() {
  const { gammes } = siteContent;

  return (
    <div className="bg-graphite">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: gammes.hero.title, item: "https://www.apertura-di-corsica.fr/gammes" },
        ])}
      />
      <Section className="relative min-h-[80vh] w-full" data-snap="true">
        <div className="absolute inset-0">
          <Image src={gammes.hero.image} alt={gammes.hero.alt} fill className="object-cover" />
          <div className="absolute inset-0 bg-graphite/60 md:bg-graphite/50" />
        </div>
        <div className="relative z-10 flex min-h-[80vh] items-end px-5 pb-16">
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="section-heading">{gammes.hero.title}</h1>
            <p className="section-body mt-4 whitespace-pre-line max-w-2xl">{gammes.hero.text}</p>
          </div>
        </div>
      </Section>

      {gammes.ranges.map((range) => (
        <Section key={range.name} className="relative min-h-[75vh]" data-snap="true">
          <div className="absolute inset-0">
            <Image src={range.image} alt={range.alt} fill className="object-cover" />
            <div className="absolute inset-0 bg-graphite/65 md:bg-graphite/55" />
          </div>
          <div className="relative z-10 flex min-h-[75vh] items-end px-5 pb-16">
            <div className="mx-auto w-full max-w-4xl">
              <h2 className="text-3xl font-semibold text-ivoire md:text-5xl">{range.name}</h2>
              <p className="mt-4 text-base text-ivoire/80 whitespace-pre-line md:text-lg">{range.text}</p>
              <ul className="mt-6 space-y-2 text-sm text-ivoire/70">
                {range.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      <Section id={gammes.interior.anchor} className="bg-graphite py-20" data-snap="true">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="section-heading">{gammes.interior.title}</h2>
              <p className="section-body mt-4 whitespace-pre-line">{gammes.interior.text}</p>
            </div>
            <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
              <Image src={gammes.interior.hero} alt={gammes.interior.heroAlt} fill className="object-cover" />
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {gammes.interior.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-ivoire/10 p-4">
                <div className="relative mb-4 h-40 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.alt} fill className="object-cover" />
                </div>
                <h3 className="text-sm font-semibold text-ivoire">{item.title}</h3>
                <p className="mt-2 text-xs text-ivoire/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
