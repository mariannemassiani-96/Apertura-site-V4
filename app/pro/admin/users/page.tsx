import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if ((session.user as any).role !== "ADMIN") redirect("/pro/dashboard");

  return (
    <main style={{ maxWidth: 980, margin: "32px auto", padding: 16 }}>
      <h1>Utilisateurs (Entreprise)</h1>
      <p style={{ opacity: 0.8 }}>
        Créez des comptes, attribuez des rôles et envoyez des invitations.
      </p>

      <UsersClient />
    </main>
  );
}
