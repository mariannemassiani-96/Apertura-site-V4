"use client";

import { ReactNode } from "react";

// ✅ Guard désactivé : la protection est côté serveur (app/pro/layout.tsx)
export function AuthGuard({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
