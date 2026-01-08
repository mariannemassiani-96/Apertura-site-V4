import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.vision.title,
  description: siteContent.pageMeta.vision.description,
  path: "/vision",
});

export default function VisionPage() {
  const { vision } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: vision.title, item: "https://www.apertura-di-corsica.fr/vision" },
        ])}
      />
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{vision.heading}</h1>
        <p className="section-body mt-6 max-w-2xl">{vision.intro}</p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {vision.sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-ivoire/10 p-6">
              <h2 className="text-lg font-semibold text-ivoire">{section.title}</h2>
              <p className="mt-4 text-sm text-ivoire/70">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
