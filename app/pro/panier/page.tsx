import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { CartClient } from "@/app/pro/panier/CartClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.panier.title,
  description: siteContent.pageMeta.pro.panier.description,
  path: "/pro/panier",
});

export default function ProCartPage() {
  return (
    <ProPageShell>
      <CartClient />
    </ProPageShell>
  );
}
