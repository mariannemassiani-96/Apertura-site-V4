import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.panier.title,
  description: siteContent.pageMeta.panier.description,
  path: "/panier",
});

export default function PanierPage() {
  const { cart } = siteContent.commerce;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: cart.title, item: "https://www.apertura-di-corsica.fr/panier" },
        ])}
      />
      <div className="mx-auto w-full max-w-4xl px-5">
        <h1 className="section-heading">{cart.title}</h1>
        <p className="section-body mt-6">{cart.text}</p>
      </div>
    </Section>
  );
}
