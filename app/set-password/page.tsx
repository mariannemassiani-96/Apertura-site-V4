"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SetPasswordPage() {
  const sp = useSearchParams();
  const token = sp.get("token") || "";

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!token) return setMsg("Lien invalide.");
    if (pwd.length < 10) return setMsg("Mot de passe trop court (min 10 caractères).");
    if (pwd !== pwd2) return setMsg("Les mots de passe ne correspondent pas.");

    setLoading(true);
    const res = await fetch("/api/auth/set-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, password: pwd }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setMsg(data?.error || "Erreur. Le lien est peut-être expiré.");
      return;
    }

    // On renvoie vers login
    window.location.assign("/login");
  }

  return (
    <main style={{ maxWidth: 520, margin: "56px auto", padding: 16 }}>
      <h1>Définir mon mot de passe</h1>
      <p style={{ opacity: 0.8 }}>Ce lien est valable 24h.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 18 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Nouveau mot de passe</span>
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Confirmer</span>
          <input type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} required />
        </label>

        {msg && <p style={{ color: "crimson", margin: 0 }}>{msg}</p>}

        <button disabled={loading} type="submit">
          {loading ? "Validation..." : "Valider"}
        </button>
      </form>
    </main>
  );
}
