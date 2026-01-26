"use client";

import { useEffect, useMemo, useState } from "react";

type AlertLevel = "info" | "warning" | "danger";
type CompanyCode = "TOTAL" | "SIAL" | "ISULA";

type Kpis = {
  quotes: { pending: number; signed: number };
  orders: { toSign: number; toPay: number; inProgress: number };
  deliveries: { upcoming: number; confirmed: number };
  sav: { open: number };
};

type Summary = {
  user: { name?: string | null; email?: string | null; role?: string | null };
  company: { id: string; name: string };
  kpisTotal: Kpis;
  kpisByCompany: { SIAL: Kpis; ISULA: Kpis };
  snapshots: { SIAL: string | null; ISULA: string | null };
  alerts: Array<{
    id: string;
    level: AlertLevel;
    title: string;
    body: string;
    cta?: { label: string; href: string };
  }>;
};

function Badge({ level }: { level: AlertLevel }) {
  const bg =
    level === "danger" ? "#fde2e2" : level === "warning" ? "#fff3cd" : "#e7f3ff";
  const fg =
    level === "danger" ? "#7a1c1c" : level === "warning" ? "#6b4e00" : "#084a7a";
  return (
    <span
      style={{
        background: bg,
        color: fg,
        borderRadius: 999,
        padding: "2px 10px",
        fontSize: 12,
        display: "inline-block",
      }}
    >
      {level.toUpperCase()}
    </span>
  );
}

function KpiCard(props: {
  title: string;
  value: number;
  hint?: string;
  href?: string;
}) {
  const content = (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 14,
        minHeight: 84,
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.75 }}>{props.title}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
        {props.value}
      </div>
      {props.hint && (
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
          {props.hint}
        </div>
      )}
    </div>
  );

  if (props.href) {
    return (
      <a href={props.href} style={{ textDecoration: "none", color: "inherit" }}>
        {content}
      </a>
    );
  }

  return content;
}

function ToggleButton(props: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={props.onClick}
      style={{
        padding: "8px 10px",
        borderRadius: 999,
        border: "1px solid #eee",
        background: props.active ? "#111" : "transparent",
        color: props.active ? "#fff" : "inherit",
        cursor: "pointer",
      }}
    >
      {props.label}
    </button>
  );
}

function formatSnapshot(ts: string | null) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return ts;
  return d.toLocaleString();
}

export default function DashboardClient() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [scope, setScope] = useState<CompanyCode>("TOTAL");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/pro/dashboard/summary");
    const data = (await res.json().catch(() => null)) as Summary | null;

    if (!res.ok || !data) {
      setErr("Impossible de charger le dashboard.");
      setLoading(false);
      return;
    }
    setSummary(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const displayName = useMemo(() => {
    const n = summary?.user?.name?.trim();
    return n ? n : summary?.user?.email ?? "";
  }, [summary]);

  const kpis: Kpis | null = useMemo(() => {
    if (!summary) return null;
    if (scope === "TOTAL") return summary.kpisTotal;
    return summary.kpisByCompany[scope];
  }, [summary, scope]);

  const scopeLabel = useMemo(() => {
    if (scope === "TOTAL") return "Total (SIAL + ISULA)";
    return scope;
  }, [scope]);

  if (loading) return <p>Chargement…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!summary || !kpis) return null;

  return (
    <div style={{ marginTop: 18, display: "grid", gap: 16 }}>
      {/* Header mini */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Connecté : <b>{displayName}</b> — {summary.user.role}
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Entreprise : <b>{summary.company.name}</b>
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <ToggleButton
              active={scope === "TOTAL"}
              label="Total"
              onClick={() => setScope("TOTAL")}
            />
            <ToggleButton
              active={scope === "SIAL"}
              label="SIAL"
              onClick={() => setScope("SIAL")}
            />
            <ToggleButton
              active={scope === "ISULA"}
              label="ISULA"
              onClick={() => setScope("ISULA")}
            />
            <span style={{ fontSize: 12, opacity: 0.75, alignSelf: "center" }}>
              Vue : <b>{scopeLabel}</b>
            </span>
          </div>

          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
            Snapshots — SIAL: {formatSnapshot(summary.snapshots.SIAL)} / ISULA:{" "}
            {formatSnapshot(summary.snapshots.ISULA)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a href="/pro/demandes/nouvelle">
            <button style={{ padding: "10px 12px" }}>Nouvelle demande de devis</button>
          </a>
          <a href="/pro/support">
            <button style={{ padding: "10px 12px" }}>Support / SAV</button>
          </a>
          <a href="/pro/mentions">
            <button style={{ padding: "10px 12px" }}>Mentions</button>
          </a>
        </div>
      </div>

      {/* Alerts */}
      <div style={{ display: "grid", gap: 10 }}>
        {summary.alerts.map((a) => (
          <div
            key={a.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 14,
              display: "grid",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 600 }}>{a.title}</div>
              <Badge level={a.level} />
            </div>
            <div style={{ opacity: 0.85 }}>{a.body}</div>
            {a.cta && (
              <div>
                <a href={a.cta.href}>{a.cta.label}</a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* KPI grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        <KpiCard title="Devis en attente" value={kpis.quotes.pending} href="/pro/devis" />
        <KpiCard
          title="Commandes à signer"
          value={kpis.orders.toSign}
          href="/pro/commandes"
        />
        <KpiCard
          title="Livraisons confirmées"
          value={kpis.deliveries.confirmed}
          href="/pro/livraisons"
        />
        <KpiCard title="SAV ouverts" value={kpis.sav.open} href="/pro/support" />
      </div>

      <div style={{ opacity: 0.7, fontSize: 12 }}>
        Dernière mise à jour : temps réel (MVP).{" "}
        <button onClick={load}>Rafraîchir</button>
      </div>
    </div>
  );
}
