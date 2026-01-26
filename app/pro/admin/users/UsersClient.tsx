"use client";

import { useEffect, useState } from "react";

type Role = "ADMIN" | "COMMERCIAL" | "TECHNIQUE" | "COMPTABLE";
type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  last_login_at?: string | null;
};

export default function UsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("COMMERCIAL");

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/admin/users");
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setErr(data?.error || "Erreur chargement");
      return;
    }
    setUsers(data.users || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name, role }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data?.error || "Erreur création");
      return;
    }

    setEmail("");
    setName("");
    setRole("COMMERCIAL");
    await load();
  }

  async function invite(userId: string) {
    setErr(null);
    const res = await fetch(`/api/admin/users/${userId}/invite`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data?.error || "Erreur invitation");
      return;
    }
    alert("Invitation envoyée.");
  }

  async function toggleActive(u: UserRow) {
    setErr(null);
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ is_active: !u.is_active }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(data?.error || "Erreur mise à jour");
      return;
    }
    await load();
  }

  return (
    <div style={{ marginTop: 18 }}>
      <h2 style={{ marginBottom: 8 }}>Créer un utilisateur</h2>

      <form onSubmit={createUser} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="ADMIN">Admin entreprise</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="TECHNIQUE">Technique</option>
          <option value="COMPTABLE">Comptable</option>
        </select>
        <button type="submit">Créer</button>
      </form>

      {err && <p style={{ color: "crimson", marginTop: 10 }}>{err}</p>}

      <h2 style={{ marginTop: 28 }}>Utilisateurs</h2>

      {loading ? (
        <p>Chargement…</p>
      ) : (
        <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Nom</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Rôle</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Actif</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 8 }}>{u.name}</td>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.role}</td>
                <td style={{ padding: 8 }}>{u.is_active ? "Oui" : "Non"}</td>
                <td style={{ padding: 8, display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => invite(u.id)}>Inviter</button>
                  <button type="button" onClick={() => toggleActive(u)}>
                    {u.is_active ? "Désactiver" : "Activer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
