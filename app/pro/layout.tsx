export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { hasAcceptedLatestCgvs } from "@/lib/db/queries/legal";

export default async function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/pro/dashboard");
  }

  const userId = (session.user as any).id;

  const ok = await hasAcceptedLatestCgvs(userId);
  if (!ok) redirect("/first-login/accept-cgv");

  return <>{children}</>;
}
