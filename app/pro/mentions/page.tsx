import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.mentions.title,
  description: siteContent.pageMeta.pro.mentions.description,
  path: "/pro/mentions",
});

export default function ProMentionsPage() {
  const { mentions } = siteContent.pro;

  return (
    <ProPageShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-ivoire">{mentions.title}</h1>
        <p className="text-sm text-ivoire/70">{mentions.text}</p>
      </div>
    </ProPageShell>
  );
}
