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
        /* ---- GROUND: marble white, not aged paper ----
           The previous warm ivory sat at the same temperature as the gold
           accent, so gold read as dullness rather than light. A cool ground
           gives the warm accents something to shine against. */
        surface: {
          DEFAULT: "#FDFDFC", // marble white page
          2: "#FFFFFF",       // cards sit slightly brighter than the page
          sunk: "#F1F5F6",    // cool stone wash - the alternating band
        },
        card: "#FFFFFF",
        field: "#FFFFFF",
        scrim: "#201C17",     // deliberate dark veil over photos / modals
        line: "#E4E4DE",      // neutral hairline: reads on warm and cool alike

        /* ---- INK ---- */
        ink: {
          DEFAULT: "#2B2620",
          soft: "#675E54",
        },
        "on-gold": "#2B2620",

        /* ---- KUMKUM: the heading colour. Headings were gold and read as
           washed out; sindoor red is the devotional register and carries
           far better contrast on a pale ground. ---- */
        kumkum: {
          DEFAULT: "#B81F27",
          dk: "#7E1319",
        },
        leaf: "#2E6B52",

        /* ---- GOLD: demoted to decoration - rules, icons, small labels.
           700/800 are the only shades used for text. ---- */
        gold: {
          50: "#FFFDF6",
          100: "#FAF1DA",
          200: "#F2E3B8",
          300: "#E3C878",
          400: "#CFAE4F",
          500: "#B98F23",
          600: "#9D7A1C",
          700: "#876612",
          800: "#6B500E",
          900: "#4A360B",
          muted: "#7A6436",
          antique: "#B98F23",
          bright: "#E3C878",
          warm: "#9D7A1C",
        },

        /* decorative tints behind ink */
        spiritual: {
          maroon: "#F3CBCF",
          emerald: "#C4E2D3",
          purple: "#D8CDE8",
        },
      },
      fontFamily: {
        devanagari: ["Mukta", "Noto Sans Devanagari", "sans-serif"],
        heading: ["Tiro Devanagari Hindi", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Mukta", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E3C878 0%, #B98F23 55%, #9D7A1C 100%)",
        "gold-radial": "radial-gradient(circle at center, rgba(185, 143, 35, 0.12) 0%, rgba(253, 253, 252, 0) 70%)",
        "spiritual-vignette": "radial-gradient(circle at center, transparent 35%, rgba(184, 144, 42, 0.10) 100%)",
        "card-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(250, 243, 228, 0.88) 100%)",
        "gold-border-gradient": "linear-gradient(135deg, rgba(184, 144, 42, 0.55) 0%, rgba(184, 144, 42, 0.18) 50%, rgba(156, 120, 33, 0.55) 100%)",
      },
      boxShadow: {
        "gold-sm": "0 2px 10px rgba(38, 40, 42, 0.055)",
        "gold-md": "0 14px 36px rgba(38, 40, 42, 0.10)",
        "gold-lg": "0 30px 70px rgba(38, 40, 42, 0.17)",
        "gold-inset": "inset 0 1px 3px rgba(38, 40, 42, 0.06)",
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
