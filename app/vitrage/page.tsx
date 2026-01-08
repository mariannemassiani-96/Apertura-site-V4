import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.vitrage.title,
  description: siteContent.pageMeta.vitrage.description,
  path: "/vitrage",
});

export default function VitragePage() {
  const { vitrage } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: vitrage.title, item: "https://www.apertura-di-corsica.fr/vitrage" },
        ])}
      />
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{vitrage.title}</h1>
        <p className="section-body mt-6 whitespace-pre-line">{vitrage.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {vitrage.sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-ivoire/10 p-6">
              <h2 className="text-lg font-semibold text-ivoire">{section.title}</h2>
              <p className="mt-4 text-sm text-ivoire/70">{section.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-ivoire/60">{vitrage.climate}</p>
      </div>
    </Section>
  );
}
