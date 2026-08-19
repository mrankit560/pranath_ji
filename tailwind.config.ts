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
        spiritual: {
          navy: "#0D0A08",
          dark: "#080605",
          midnight: "#111827",
          maroon: "#641E2A",
          emerald: "#285C45",
          purple: "#51325F",
          ivory: "#F7F1E3",
          card: "rgba(18, 14, 12, 0.85)",
          glass: "rgba(13, 10, 8, 0.88)",
        },
        gold: {
          50: "#FFFDF7",
          100: "#FFF9E6",
          200: "#FFF0BF",
          300: "#FCE28D",
          400: "#F4D06F",
          500: "#D4AF37",
          600: "#C6922E",
          700: "#9E711E",
          800: "#704F15",
          900: "#4A330B",
          muted: "#D8C79A",
          antique: "#D4AF37",
          bright: "#F4D06F",
          warm: "#C6922E",
        },
      },
      fontFamily: {
        devanagari: ["Noto Sans Devanagari", "var(--font-noto-devanagari)", "sans-serif"],
        heading: ["Rozha One", "Cinzel", "var(--font-cinzel)", "serif"],
        sans: ["Inter", "Poppins", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F4D06F 0%, #D4AF37 50%, #C6922E 100%)",
        "gold-radial": "radial-gradient(circle at center, rgba(244, 208, 111, 0.22) 0%, rgba(13, 10, 8, 0) 70%)",
        "spiritual-vignette": "radial-gradient(circle at center, transparent 30%, rgba(8, 6, 5, 0.85) 100%)",
        "card-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(212, 175, 55, 0.03) 100%)",
        "gold-border-gradient": "linear-gradient(135deg, rgba(244, 208, 111, 0.6) 0%, rgba(212, 175, 55, 0.2) 50%, rgba(198, 146, 46, 0.6) 100%)",
      },
      boxShadow: {
        "gold-sm": "0 0 10px rgba(212, 175, 55, 0.2)",
        "gold-md": "0 0 20px rgba(212, 175, 55, 0.35)",
        "gold-lg": "0 0 35px rgba(244, 208, 111, 0.45)",
        "gold-inset": "inset 0 0 15px rgba(212, 175, 55, 0.2)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(0.5deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(0.85)", opacity: "0.6" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spinSlow 120s linear infinite",
        shimmer: "shimmer 3s infinite linear",
        breathe: "breathe 10s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
