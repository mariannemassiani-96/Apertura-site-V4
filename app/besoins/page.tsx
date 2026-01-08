import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.besoins.title,
  description: siteContent.pageMeta.besoins.description,
  path: "/besoins",
});

export default function BesoinsPage() {
  const { besoins } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: besoins.title, item: "https://www.apertura-di-corsica.fr/besoins" },
        ])}
      />
      <div className="mx-auto w-full max-w-6xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{besoins.title}</h1>
        <p className="section-body mt-6 whitespace-pre-line max-w-2xl">{besoins.intro}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {besoins.needs.map((need) => (
            <div key={need.title} className="rounded-2xl border border-ivoire/10 p-5">
              <h2 className="text-sm font-semibold text-ivoire">{need.title}</h2>
              <p className="mt-3 text-sm text-ivoire/70">{need.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {besoins.rooms.map((room) => (
            <div key={room.title} className="rounded-2xl bg-ivoire/5 p-6">
              <h2 className="text-base font-semibold text-ivoire">{room.title}</h2>
              <p className="mt-3 text-sm text-ivoire/70">{room.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
