import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.apertura-di-corsica.fr";
  const routes = [
    "",
    "/vision",
    "/besoins",
    "/gammes",
    "/vitrage",
    "/fabrication",
    "/seconda-vita",
    "/seconda-vita/produits",
    "/casapertura",
    "/contact",
    "/mentions",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
