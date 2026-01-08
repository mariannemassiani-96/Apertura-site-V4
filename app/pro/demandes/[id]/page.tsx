import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { RequestDetailClient } from "@/app/pro/demandes/[id]/RequestDetailClient";

export const generateMetadata = ({ params }: { params: { id: string } }) =>
  buildMetadata({
    title: `${siteContent.pageMeta.pro.demandes.title}${labels.symbols.separator}${params.id}`,
    description: siteContent.pageMeta.pro.demandes.description,
    path: `/pro/demandes/${params.id}`,
  });

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProPageShell>
      <RequestDetailClient id={params.id} />
    </ProPageShell>
  );
}
