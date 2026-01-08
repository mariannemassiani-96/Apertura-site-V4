import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { ConfiguratorClient } from "@/app/pro/configurateur/ConfiguratorClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.configurateur.title,
  description: siteContent.pageMeta.pro.configurateur.description,
  path: "/pro/configurateur",
});

export default function ConfigurateurPage() {
  return (
    <ProPageShell>
      <ConfiguratorClient />
    </ProPageShell>
  );
}
