"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { authenticated, ready } = useAuth();

  useEffect(() => {
    if (ready && !authenticated) {
      router.replace("/pro/login");
    }
  }, [authenticated, ready, router]);

  if (!ready || !authenticated) {
    return <div className="min-h-screen bg-graphite" />;
  }

  return <>{children}</>;
};
