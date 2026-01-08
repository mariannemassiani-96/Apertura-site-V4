import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";
import { DashboardClient } from "@/app/pro/dashboard/DashboardClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.dashboard.title,
  description: siteContent.pageMeta.pro.dashboard.description,
  path: "/pro/dashboard",
});

export default function ProDashboardPage() {
  return (
    <ProPageShell>
      <DashboardClient />
    </ProPageShell>
  );
}
