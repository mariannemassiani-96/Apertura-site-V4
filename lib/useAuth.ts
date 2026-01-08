"use client";

import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setReady(true);
  }, []);

  return { authenticated, ready, setAuthenticated };
};
