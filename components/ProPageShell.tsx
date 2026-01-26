import { ReactNode } from "react";
import { ProLayout } from "@/components/ProLayout";

// ✅ On enlève AuthGuard : c’est app/pro/layout.tsx qui protège
export const ProPageShell = ({ children }: { children: ReactNode }) => (
  <ProLayout>{children}</ProLayout>
);
