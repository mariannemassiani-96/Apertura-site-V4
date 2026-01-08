import { siteContent, labels } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { QuoteDetailClient } from "@/app/pro/devis/[id]/QuoteDetailClient";

export const generateMetadata = ({ params }: { params: { id: string } }) =>
  buildMetadata({
    title: `${siteContent.pageMeta.pro.devis.title}${labels.symbols.separator}${params.id}`,
    description: siteContent.pageMeta.pro.devis.description,
    path: `/pro/devis/${params.id}`,
  });

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProPageShell>
      <QuoteDetailClient id={params.id} />
    </ProPageShell>
  );
}
