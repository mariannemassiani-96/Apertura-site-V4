import DashboardClient from "./DashboardClient";

export default function ProDashboardPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: 16 }}>
      <h1>Dashboard PRO</h1>
      <p style={{ opacity: 0.8, marginTop: 4 }}>
        Vue rapide sur l’activité, les actions et les statuts.
      </p>

      <DashboardClient />
    </main>
  );
}
