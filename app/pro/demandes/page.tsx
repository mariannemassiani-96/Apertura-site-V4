import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { RequestsClient } from "@/app/pro/demandes/RequestsClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.demandes.title,
  description: siteContent.pageMeta.pro.demandes.description,
  path: "/pro/demandes",
});

export default function ProRequestsPage() {
  return (
    <ProPageShell>
      <RequestsClient />
    </ProPageShell>
  );
}
