import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        eos: {
          glow: "hsl(var(--eos-glow))",
          surface: "hsl(var(--eos-surface))",
          "surface-elevated": "hsl(var(--eos-surface-elevated))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "high-value-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 hsl(var(--success) / 0)",
            borderColor: "hsl(var(--success) / 0.5)"
          },
          "50%": { 
            boxShadow: "0 0 12px 2px hsl(var(--success) / 0.4)",
            borderColor: "hsl(var(--success))"
          },
        },
        "delta-flash": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "20%": { opacity: "1", transform: "translateY(0)" },
          "80%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-4px)" },
        },
        "emergence-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 hsl(var(--warning) / 0)",
          },
          "50%": { 
            boxShadow: "0 0 20px 4px hsl(var(--warning) / 0.5)",
          },
        },
        "sovereignty-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(251, 191, 36, 0)",
            borderColor: "rgba(251, 191, 36, 0.3)"
          },
          "50%": { 
            boxShadow: "0 0 25px 5px rgba(251, 191, 36, 0.4)",
            borderColor: "rgba(251, 191, 36, 0.8)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "high-value-pulse": "high-value-pulse 1.5s ease-in-out infinite",
        "delta-flash": "delta-flash 2s ease-out forwards",
        "emergence-glow": "emergence-glow 2s ease-in-out infinite",
        "sovereignty-glow": "sovereignty-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
