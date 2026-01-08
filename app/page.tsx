import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";
import SavorHome from "@/components/home/SavorHome";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.home.title,
  description: siteContent.pageMeta.home.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: labels.breadcrumb.home, item: "https://www.apertura-di-corsica.fr/" },
        ])}
      />
      <SavorHome />
    </>
  );
}
