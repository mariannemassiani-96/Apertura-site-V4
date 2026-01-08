import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.contact.title,
  description: siteContent.pageMeta.contact.description,
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = siteContent;

  return (
    <Section className="bg-graphite py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
          { name: contact.title, item: "https://www.apertura-di-corsica.fr/contact" },
        ])}
      />
      <div className="mx-auto w-full max-w-4xl px-5">
        <div className="section-title">{siteContent.brand.name}</div>
        <h1 className="section-heading mt-4">{contact.title}</h1>
        <p className="section-body mt-6">{contact.intro}</p>
        <form className="mt-10 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={contact.form.name}
            aria-label={contact.form.name}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={contact.form.email}
            aria-label={contact.form.email}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={contact.form.phone}
            aria-label={contact.form.phone}
          />
          <input
            className="rounded-full border border-ivoire/20 bg-transparent px-5 py-3 text-sm text-ivoire"
            placeholder={contact.form.city}
            aria-label={contact.form.city}
          />
          <textarea
            className="md:col-span-2 min-h-[160px] rounded-2xl border border-ivoire/20 bg-transparent px-5 py-4 text-sm text-ivoire"
            placeholder={contact.form.message}
            aria-label={contact.form.message}
          />
          <button
            type="submit"
            className="md:col-span-2 rounded-full bg-cuivre px-6 py-3 text-xs uppercase tracking-wide text-graphite"
          >
            {contact.form.submit}
          </button>
        </form>
      </div>
    </Section>
  );
}
