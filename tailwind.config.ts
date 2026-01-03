import type {Config} from 'tailwindcss';
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        orbitron: ["var(--font-orbitron)"],
      },
      colors: {
        background: 'hsl(var(--main-bg))',
        foreground: 'hsl(var(--text-primary))',
        card: {
          DEFAULT: 'hsl(var(--card-bg))',
          foreground: 'hsl(var(--text-primary))',
        },
        popover: {
          DEFAULT: 'hsl(var(--card-bg))',
          foreground: 'hsl(var(--text-primary))',
        },
        primary: {
          DEFAULT: 'hsl(var(--button-bg))',
          foreground: 'hsl(var(--button-text))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--main-bg))',
          foreground: 'hsl(var(--text-secondary))',
        },
        muted: {
          DEFAULT: 'hsl(var(--card-bg))',
          foreground: 'hsl(var(--text-secondary))',
        },
        accent: {
          DEFAULT: 'hsl(var(--text-accent))',
          foreground: 'hsl(var(--text-primary))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--button-bg))',
          foreground: 'hsl(var(--button-text))',
        },
        border: 'hsl(var(--border-color))',
        input: 'hsl(var(--card-bg))',
        ring: 'hsl(var(--ring-color))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-bg))',
          foreground: 'hsl(var(--text-primary))',
          border: 'hsl(var(--sidebar-border, var(--border-color)))',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius)",
        sm: "var(--radius)",
      },
      boxShadow: {
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow)',
        lg: 'var(--shadow)',
        xl: 'var(--shadow)',
        '2xl': 'var(--shadow)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
