"use client";

import { useState } from "react";

export default function AcceptCgvPage() {
  const [loading, setLoading] = useState(false);

  async function accept() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/legal/accept", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);
      console.log("accept-cgv response:", res.status, data);

      if (!res.ok) {
        throw new Error("Accept CGV failed");
      }

      /**
       * IMPORTANT :
       * hard redirect pour forcer :
       * - relecture DB
       * - rechargement layout /pro
       * - pas de cache RSC
       */
      window.location.assign("/pro/dashboard");
    } catch (e) {
      console.error(e);
      setLoading(false);
      alert("Erreur lors de l’acceptation des CGV. Réessaie.");
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "56px auto", padding: 16 }}>
      <h1>Conditions Générales</h1>

      <p style={{ opacity: 0.85 }}>
        Pour accéder au Portail PRO Apertura, vous devez accepter :
      </p>

      <ul style={{ marginTop: 16, lineHeight: 1.6 }}>
        <li>
          <a href="/legal/cgv-portail" target="_blank" rel="noreferrer">
            Conditions Générales d’Utilisation du Portail
          </a>
        </li>
        <li>
          <a href="/legal/cgv-vente" target="_blank" rel="noreferrer">
            Conditions Générales de Vente
          </a>
        </li>
      </ul>

      <button
        onClick={accept}
        disabled={loading}
        style={{
          marginTop: 24,
          padding: 12,
          width: "100%",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Validation…" : "J’accepte les conditions"}
      </button>

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
        L’acceptation est enregistrée et horodatée.
      </p>
    </main>
  );
}
