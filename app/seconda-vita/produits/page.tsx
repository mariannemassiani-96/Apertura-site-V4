import Link from "next/link";
import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.secondaVitaProducts.title,
  description: siteContent.pageMeta.secondaVitaProducts.description,
  path: "/seconda-vita/produits",
});

export default function SecondaVitaProductsPage() {
  const { secondaVitaProducts } = siteContent;
  const secondaVitaLabel =
    siteContent.navigation.main.find((item) => item.href === "/seconda-vita")?.label ?? "";

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: secondaVitaLabel, item: "https://www.apertura-di-corsica.fr/seconda-vita" },
          { name: secondaVitaProducts.title, item: "https://www.apertura-di-corsica.fr/seconda-vita/produits" },
        ])}
      />
      <div className="mx-auto w-full max-w-5xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{secondaVitaProducts.title}</h1>
        <p className="section-body mt-6">{secondaVitaProducts.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {secondaVitaProducts.products.map((product) => (
            <Link
              key={product.slug}
              href={`/seconda-vita/produits/${product.slug}`}
              className="rounded-2xl border border-ivoire/10 p-6"
            >
              <h2 className="text-base font-semibold text-ivoire">{product.title}</h2>
              <p className="mt-3 text-sm text-ivoire/70">{product.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
