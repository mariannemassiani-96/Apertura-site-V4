import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.casapertura.title,
  description: siteContent.pageMeta.casapertura.description,
  path: "/casapertura",
});

export default function CasaperturaPage() {
  const { casapertura } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: casapertura.title, item: "https://www.apertura-di-corsica.fr/casapertura" },
        ])}
      />
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{casapertura.title}</h1>
        <p className="section-body mt-6">{casapertura.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {casapertura.sections.map((section) => (
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
