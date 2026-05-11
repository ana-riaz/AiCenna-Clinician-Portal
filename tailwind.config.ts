import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        muted: "var(--muted)",
        dim: "var(--dim)",
        navy: "var(--navy)",
        indigo: "var(--indigo)",
        violet: "var(--violet)",
        cyan: "var(--cyan)",
        rose: "var(--rose)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        glass: "var(--glass)",
        "glass-strong": "var(--glass-strong)",
        "glass-border": "var(--glass-border)",
        field: "var(--field)",
        "field-border": "var(--field-border)",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
