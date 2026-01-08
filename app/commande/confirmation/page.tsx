import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.confirmation.title,
  description: siteContent.pageMeta.confirmation.description,
  path: "/commande/confirmation",
});

export default function ConfirmationPage() {
  const { confirmation } = siteContent.commerce;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: confirmation.title, item: "https://www.apertura-di-corsica.fr/commande/confirmation" },
        ])}
      />
      <div className="mx-auto w-full max-w-4xl px-5">
        <h1 className="section-heading">{confirmation.title}</h1>
        <p className="section-body mt-6">{confirmation.text}</p>
      </div>
    </Section>
  );
}
