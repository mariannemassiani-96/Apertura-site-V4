import { siteContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProLoginClient } from "@/app/pro/login/ProLoginClient";

export const metadata = buildMetadata({
  title: siteContent.pageMeta.pro.login.title,
  description: siteContent.pageMeta.pro.login.description,
  path: "/pro/login",
});

export default function ProLoginPage() {
  return <ProLoginClient />;
}
