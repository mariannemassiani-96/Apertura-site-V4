import { notFound } from "next/navigation";
import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/structuredData";

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const product = siteContent.secondaVitaProducts.products.find(
    (item) => item.slug === params.slug,
  );
  if (!product) {
    return buildMetadata({
      title: siteContent.pageMeta.secondaVitaProducts.title,
      description: siteContent.pageMeta.secondaVitaProducts.description,
      path: "/seconda-vita/produits",
    });
  }

  return buildMetadata({
    title: `${product.title}${labels.symbols.separator}${siteContent.pageMeta.secondaVitaProducts.title}`,
    description: product.description,
    path: `/seconda-vita/produits/${product.slug}`,
  });
};

export default function SecondaVitaProductPage({ params }: { params: { slug: string } }) {
  const product = siteContent.secondaVitaProducts.products.find(
    (item) => item.slug === params.slug,
  );
  const secondaVitaLabel =
    siteContent.navigation.main.find((item) => item.href === "/seconda-vita")?.label ?? "";

  if (!product) {
    notFound();
  }

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: secondaVitaLabel, item: "https://www.apertura-di-corsica.fr/seconda-vita" },
          { name: siteContent.secondaVitaProducts.title, item: "https://www.apertura-di-corsica.fr/seconda-vita/produits" },
          {
            name: product.title,
            item: `https://www.apertura-di-corsica.fr/seconda-vita/produits/${product.slug}`,
          },
        ])}
      />
      <JsonLd data={productJsonLd({ name: product.title, description: product.description, sku: product.slug })} />
      <div className="mx-auto w-full max-w-3xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{product.title}</h1>
        <p className="section-body mt-6">{product.description}</p>
      </div>
    </Section>
  );
}
