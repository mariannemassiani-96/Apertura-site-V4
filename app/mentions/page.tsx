import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.mentions.title,
  description: siteContent.pageMeta.mentions.description,
  path: "/mentions",
});

export default function MentionsPage() {
  const { mentions } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: mentions.title, item: "https://www.apertura-di-corsica.fr/mentions" },
        ])}
      />
      <div className="mx-auto w-full max-w-4xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{mentions.title}</h1>
        <p className="section-body mt-6">{mentions.text}</p>
      </div>
    </Section>
  );
}
