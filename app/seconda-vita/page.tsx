import Link from "next/link";
import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.secondaVita.title,
  description: siteContent.pageMeta.secondaVita.description,
  path: "/seconda-vita",
});

export default function SecondaVitaPage() {
  const { secondaVita, secondaVitaProducts } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: secondaVita.title, item: "https://www.apertura-di-corsica.fr/seconda-vita" },
        ])}
      />
      <div className="mx-auto w-full max-w-4xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{secondaVita.title}</h1>
        <p className="section-body mt-6 whitespace-pre-line">{secondaVita.intro}</p>
        <Link
          href="/seconda-vita/produits"
          className="mt-8 inline-flex rounded-full border border-cuivre px-6 py-3 text-xs uppercase tracking-wide text-cuivre"
        >
          {secondaVitaProducts.title}
        </Link>
      </div>
    </Section>
  );
}
