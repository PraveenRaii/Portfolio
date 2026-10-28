/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system theme tokens
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
        // Burnt Orange Primary Palette
        brand: {
          50: '#FDF6F0',
          100: '#FAE8DD',
          200: '#F4CEBA',
          300: '#ECA98C',
          400: '#F08A5D',
          500: '#D96736',
          600: '#B84D26',
          700: '#943B1B',
          800: '#752F15',
          900: '#5C2511',
          DEFAULT: '#D96736',
        },
        burnt: {
          50: '#FDF6F0',
          100: '#FAE8DD',
          200: '#F4CEBA',
          300: '#ECA98C',
          400: '#F08A5D',
          500: '#D96736',
          600: '#B84D26',
          700: '#943B1B',
          800: '#752F15',
          900: '#5C2511',
        },
        // Dark theme surfaces
        dark: {
          bg: '#141513',
          card: '#1D1F1B',
          surface: '#242620',
          border: '#34352F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 20px -2px rgba(25, 26, 23, 0.05)',
        cardDark: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        glow: '0 0 25px -5px rgba(217, 103, 54, 0.35)',
        glowSm: '0 0 15px -3px rgba(217, 103, 54, 0.3)',
        orangeGlow: '0 0 25px -5px rgba(217, 103, 54, 0.25)',
      },
      letterSpacing: {
        widestTechnical: '0.12em',
      },
    },
  },
  plugins: [],
};
