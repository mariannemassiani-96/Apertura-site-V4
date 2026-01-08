import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProPageShell } from "@/components/ProPageShell";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.support.title,
  description: siteContent.pageMeta.pro.support.description,
  path: "/pro/support",
});

export default function ProSupportPage() {
  const { support } = siteContent.pro;

  return (
    <ProPageShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-ivoire">{support.title}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {support.faq.map((item) => (
            <div key={item} className="rounded-2xl border border-ivoire/10 p-5 text-sm text-ivoire/70">
              {item}
            </div>
          ))}
        </div>
      </div>
    </ProPageShell>
  );
}
