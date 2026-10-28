/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system dynamic CSS tokens
        theme: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          surfaceSecondary: 'var(--color-surface-secondary)',
          text: 'var(--color-text)',
          textMuted: 'var(--color-text-muted)',
          accent: 'var(--color-accent)',
          accentHover: 'var(--color-accent-hover)',
          border: 'var(--color-border)',
          code: 'var(--color-code-panel)',
          codeBorder: 'var(--color-code-panel-border)',
        },
        // Electric Indigo & Violet Palette
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#6366F1',
        },
        // Midnight Obsidian dark surfaces
        obsidian: {
          bg: '#090B10',
          card: '#10141E',
          surface: '#171B27',
          border: '#1E2433',
        },
        cyanAccent: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        cardDark: '0 10px 30px -4px rgba(0, 0, 0, 0.7)',
        glow: '0 0 35px -5px rgba(99, 102, 241, 0.35)',
        glowSm: '0 0 15px -3px rgba(99, 102, 241, 0.3)',
        cyanGlow: '0 0 30px -5px rgba(6, 182, 212, 0.35)',
      },
      letterSpacing: {
        widestTechnical: '0.12em',
      },
    },
  },
  plugins: [],
};
