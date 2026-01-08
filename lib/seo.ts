import type { Metadata } from "next";
import { siteContent } from "@/lib/content";

const { seo } = siteContent;

export const buildMetadata = ({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata => ({
  title,
  description,
  metadataBase: new URL("https://www.apertura-di-corsica.fr"),
  alternates: {
    canonical: path,
  },
  openGraph: {
    title,
    description,
    url: path,
    siteName: seo.defaultTitle,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: "Lumière sur une baie vitrée en Corse",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [seo.ogImage],
  },
});
