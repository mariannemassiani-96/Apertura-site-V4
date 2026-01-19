"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

let registered = false;

/**
 * Assure que GSAP + ScrollTrigger ne sont enregistrés
 * qu'une seule fois (important avec Next / React strict mode)
 */
export function ensureGsap() {
  if (registered) return;

  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
