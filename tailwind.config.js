/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          900: '#0a0a0f',
          800: '#111118',
          700: '#1a1a24',
          600: '#22222f',
        },
        neon: {
          pink: '#ff2d78',
          cyan: '#00e5ff',
          gold: '#ffd700',
          violet: '#b44fff',
          green: '#00ff88',
        },
        surface: {
          DEFAULT: '#1a1a24',
          2: '#22222f',
          3: '#2a2a3a',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(255,45,120,0.35)',
        'neon-cyan': '0 0 20px rgba(0,229,255,0.35)',
        'neon-gold': '0 0 20px rgba(255,215,0,0.35)',
        'neon-violet': '0 0 20px rgba(180,79,255,0.35)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'coin-pop': 'coinPop 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        coinPop: {
          '0%': { transform: 'scale(0) rotate(-20deg)', opacity: 0 },
          '60%': { transform: 'scale(1.3) rotate(5deg)', opacity: 1 },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
