import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { hasAcceptedLatestCgvs } from "@/lib/db/queries/legal";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const accepted = await hasAcceptedLatestCgvs(userId);

  if (!accepted) {
    redirect("/first-login/accept-cgv");
  }

  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}