import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { QuotesClient } from "@/app/pro/devis/QuotesClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.devis.title,
  description: siteContent.pageMeta.pro.devis.description,
  path: "/pro/devis",
});

export default function QuotesPage() {
  return (
    <ProPageShell>
      <QuotesClient />
    </ProPageShell>
  );
}
