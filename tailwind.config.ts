import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maquis: "#1b2f28",
        cuivre: "#b36b4a",
        graphite: "#0c0d0f",
        ivoire: "#f6f4ef",
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
