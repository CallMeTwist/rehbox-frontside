import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT:  "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark:     "#0F2557",
          mid:      "#2C5FC3",
          light:    "#E8EEFF",
        },
        secondary: {
          DEFAULT:  "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:  "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:  "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:  "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:  "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:  "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:            "hsl(var(--sidebar-background))",
          foreground:         "hsl(var(--sidebar-foreground))",
          primary:            "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent:             "hsl(var(--sidebar-accent))",
          "accent-foreground":"hsl(var(--sidebar-accent-foreground))",
          border:             "hsl(var(--sidebar-border))",
          ring:               "hsl(var(--sidebar-ring))",
        },
        "hot-pink": {
          DEFAULT: "hsl(var(--hot-pink))",
          foreground: "hsl(var(--hot-pink-foreground))",
          soft:    "#FF6BB5",
          deep:    "#C4006A",
        },
        brand: {
          blue:    "#1B3E8F",
          navy:    "#0F2557",
          mid:     "#2C5FC3",
          muted:   "#E8EEFF",
          surface: "hsl(var(--dark-surface))",
          card:    "hsl(var(--dark-card))",
        },
        coin: {
          DEFAULT:  "hsl(var(--coin))",
          foreground: "hsl(var(--coin-foreground))",
        },
        success:     "hsl(var(--success))",
        warning:     "hsl(var(--warning))",
        destructive: "hsl(var(--destructive))",
        info:        "hsl(var(--info))",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)",
        "gradient-pink":    "linear-gradient(135deg, #E5197D 0%, #C4006A 100%)",
        "gradient-hero":    "linear-gradient(135deg, #0F2557 0%, #1B3E8F 60%, #2C5FC3 100%)",
        "gradient-coin":    "linear-gradient(135deg, #F4A100 0%, #E8920A 100%)",
        "gradient-card":    "linear-gradient(145deg, #1B3E8F 0%, #162F6B 100%)",
        "gradient-progress":"linear-gradient(90deg,  #1B3E8F 0%, #E5197D 100%)",
      },
      borderRadius: {
        DEFAULT: "0.875rem",
        sm:  "0.5rem",
        md:  "0.875rem",
        lg:  "1.25rem",
        xl:  "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        full: "9999px",
      },
      boxShadow: {
        card:     "var(--shadow-card)",
        "card-hover": "var(--shadow-elevated)",
        primary:  "var(--shadow-primary)",
        pink:     "var(--shadow-pink)",
        coin:     "var(--shadow-coin)",
        elevated: "var(--shadow-elevated)",
        sm:       "var(--shadow-sm)",
        md:       "var(--shadow-md)",
        lg:       "var(--shadow-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to:   { transform: "translateX(0)",     opacity: "1" },
        },
        "fade-in-up": {
          from: { transform: "translateY(16px)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        "coin-float": {
          "0%, 100%": { transform: "translateY(0)"   },
          "50%":      { transform: "translateY(-6px)" },
        },
        "scale-in": {
          from: { transform: "scale(0.97)", opacity: "0" },
          to:   { transform: "scale(1)",    opacity: "1" },
        },
      },
      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "slide-in-left":   "slide-in-left 0.3s ease-out",
        "fade-in-up":      "fade-in-up 0.35s ease-out",
        "coin-float":      "coin-float 2s ease-in-out infinite",
        "scale-in":        "scale-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
