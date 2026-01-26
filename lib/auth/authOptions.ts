import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPgPool } from "@/lib/db/postgres";
import { verifyPassword } from "@/lib/auth/passwords";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const pool = getPgPool();
        const { rows } = await pool.query(
          `select id, company_id, email, name, role, password_hash, is_active
           from portal_users
           where email=$1
           limit 1`,
          [email]
        );

        const user = rows[0];
        if (!user || !user.is_active) return null;

        const ok = await verifyPassword(password, user.password_hash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          companyId: user.company_id,
          role: user.role,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
        token.companyId = (user as any).companyId;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.uid;
      (session.user as any).companyId = token.companyId;
      (session.user as any).role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
};