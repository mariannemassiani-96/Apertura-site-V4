import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.fabrication.title,
  description: siteContent.pageMeta.fabrication.description,
  path: "/fabrication",
});

export default function FabricationPage() {
  const { fabrication } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: fabrication.title, item: "https://www.apertura-di-corsica.fr/fabrication" },
        ])}
      />
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{fabrication.title}</h1>
        <p className="section-body mt-6">{fabrication.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {fabrication.sections.map((section) => (
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
