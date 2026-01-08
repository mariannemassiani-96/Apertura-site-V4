import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { NewRequestClient } from "@/app/pro/demandes/nouvelle/NewRequestClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.demandesNouvelle.title,
  description: siteContent.pageMeta.pro.demandesNouvelle.description,
  path: "/pro/demandes/nouvelle",
});

export default function ProNewRequestPage() {
  return (
    <ProPageShell>
      <NewRequestClient />
    </ProPageShell>
  );
}
