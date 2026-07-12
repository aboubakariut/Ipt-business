import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Palette de marque IPT Business — source unique de vérité
        brand: {
          orange: "#FF6B35",
          "orange-light": "#FF8C5A",
          teal: "#0B7B6E",
          gold: "#D4AF37",
          ink: "#161622",
          "ink-soft": "#2A2A3D"
        },
        surface: {
          DEFAULT: "#FAFAF8",
          muted: "#EDEDF2",
          card: "#FFFFFF"
        },
        text: {
          primary: "#161622",
          secondary: "#8A8A99",
          muted: "#A3A3AF"
        },
        state: {
          success: "#0B7B6E",
          danger: "#E24C4C",
          warning: "#D4AF37",
          pending: "#5B5FDE"
        }
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: {
        "4xl": "2rem"
      },
      boxShadow: {
        card: "0 2px 12px rgba(22, 22, 34, 0.06)",
        "fab": "0 8px 20px rgba(255, 107, 53, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
