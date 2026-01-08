import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { siteContent } from "@/lib/content";
import LenisProvider from "@/components/LenisProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: siteContent.seo.defaultTitle,
  description: siteContent.seo.defaultDescription,
  metadataBase: new URL("https://www.apertura-di-corsica.fr"),
  openGraph: {
    title: siteContent.seo.defaultTitle,
    description: siteContent.seo.defaultDescription,
    siteName: siteContent.seo.defaultTitle,
    images: [siteContent.seo.ogImage],
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.defaultTitle,
    description: siteContent.seo.defaultDescription,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SkipLink />
        <LenisProvider />
        <Header />
        <main id="main" className="pt-20">
          {children}
        </main>
        <Footer />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={localBusinessJsonLd} />
      </body>
    </html>
  );
}
