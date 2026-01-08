import { ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { ProLayout } from "@/components/ProLayout";

export const ProPageShell = ({ children }: { children: ReactNode }) => (
  <AuthGuard>
    <ProLayout>{children}</ProLayout>
  </AuthGuard>
);
