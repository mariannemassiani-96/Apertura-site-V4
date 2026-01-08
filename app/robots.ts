import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/pro", "/panier", "/checkout", "/commande/confirmation"],
    },
    sitemap: "https://www.apertura-di-corsica.fr/sitemap.xml",
  };
}
