import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.checkout.title,
  description: siteContent.pageMeta.checkout.description,
  path: "/checkout",
});

export default function CheckoutPage() {
  const { checkout } = siteContent.commerce;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: checkout.title, item: "https://www.apertura-di-corsica.fr/checkout" },
        ])}
      />
      <div className="mx-auto w-full max-w-4xl px-5">
        <h1 className="section-heading">{checkout.title}</h1>
        <p className="section-body mt-6">{checkout.text}</p>
      </div>
    </Section>
  );
}
