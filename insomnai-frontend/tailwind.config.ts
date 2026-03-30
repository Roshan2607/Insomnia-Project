import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#0a0a12',
        s1:    '#13131e',
        s2:    '#1a1a28',
        s3:    '#222234',
        pu:    '#7c5cfc',
        pul:   '#a78bfa',
        pud:   'rgba(124,92,252,0.15)',
        lo:    '#34d399',
        mi:    '#fbbf24',
        hi:    '#f87171',
        t1:    '#eeeef8',
        t2:    '#8888aa',
        t3:    '#55556a',
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
      },
      animation: {
        'fade-up':   'fadeUp 0.35s ease both',
        'fade-in':   'fadeIn 0.25s ease both',
        'spin-slow': 'spin 1.2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
