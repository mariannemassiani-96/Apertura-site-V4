import { siteContent } from "@/lib/content";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteContent.brand.name,
  url: "https://www.apertura-di-corsica.fr",
  areaServed: "Corsica",
  addressCountry: "FR",
};

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteContent.brand.name,
  url: "https://www.apertura-di-corsica.fr",
  areaServed: "Corse",
  addressCountry: "FR",
  priceRange: "€€€",
};

export const breadcrumbJsonLd = (items: { name: string; item: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((entry, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: entry.name,
    item: entry.item,
  })),
});

export const productJsonLd = ({
  name,
  description,
  sku,
}: {
  name: string;
  description: string;
  sku: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name,
  description,
  sku,
  brand: {
    "@type": "Brand",
    name: siteContent.brand.name,
  },
});
