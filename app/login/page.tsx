"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function safeCallbackUrl(raw: string | null) {
  // On n'accepte que des paths relatifs pour éviter les redirects bizarres (localhost, autre domaine, etc.)
  if (!raw) return "/pro/dashboard";
  try {
    // callbackUrl peut parfois être une URL absolue encodée
    // Exemple: https://xxx.app.github.dev/pro/dashboard
    // On ne garde que pathname+search si c'est la même origine (ou on tombe sur default)
    if (raw.startsWith("/")) return raw;
    const u = new URL(raw);
    const path = `${u.pathname}${u.search || ""}`;
    return path.startsWith("/") ? path : "/pro/dashboard";
  } catch {
    return "/pro/dashboard";
  }
}

export default function LoginPage() {
  const sp = useSearchParams();

  const callbackUrl = useMemo(() => {
    return safeCallbackUrl(sp.get("callbackUrl"));
  }, [sp]);

  const [email, setEmail] = useState("admin@apertura.test");
  const [password, setPassword] = useState("Test123!ChangeMe");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
      callbackUrl,
    });

    // Debug visible dans la console navigateur
    console.log("signIn result:", res);

    if (!res) {
      setErrorMsg("Erreur inconnue. Réessaie.");
      setLoading(false);
      return;
    }

    if (res.error) {
      // NextAuth renvoie souvent "CredentialsSignin" si authorize() retourne null
      setErrorMsg("Email ou mot de passe invalide (ou compte désactivé).");
      setLoading(false);
      return;
    }

    // ✅ Succès : on force un hard redirect (évite les soucis App Router/cache)
    window.location.assign(res.url || "/pro/dashboard");
  }

  return (
    <main style={{ maxWidth: 420, margin: "56px auto", padding: 16 }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Connexion PRO</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Accès réservé aux partenaires Apertura (SIAL / ISULA VITRAGE).
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: 10, width: "100%" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: 10, width: "100%" }}
          />
        </label>

        {errorMsg && <p style={{ color: "crimson", margin: "4px 0" }}>{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <a href="/forgot-password">Mot de passe oublié</a>
          <a href="/demande-compte">Demander un compte PRO</a>
        </div>

        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Redirection après login → <code>{callbackUrl}</code>
        </p>
      </form>
    </main>
  );
}
