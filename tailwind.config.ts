import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maquis: "#1b2f28",
        cuivre: "#C27A4A",
        graphite: "#161A18",
        "graphite-soft": "#1D2320",
        "graphite-card": "#0F1312",
        ivoire: "#F4F7F9",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      letterSpacing: {
        wide: "0.08em",
      },
      boxShadow: {
        soft: "0 30px 80px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
