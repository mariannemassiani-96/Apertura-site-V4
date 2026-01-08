"use client";

import { useEffect, useState } from "react";

export function useIsDesktop(breakpointPx = 1024) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [breakpointPx]);

  return isDesktop;
}
