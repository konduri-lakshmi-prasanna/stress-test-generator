/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hawkins: {
          dark: '#08090C',
          panel: '#0F1117',
          card: '#161922',
          border: '#282D3C',
          crimson: '#E50914',
          blood: '#B00710',
          glow: '#FF2A36',
          amber: '#FFB000',
          phosphor: '#22C55E',
          cyan: '#06B6D4',
          rift: '#7928CA',
          void: '#040406'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        display: ['"Cinzel"', '"Georgia"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(229, 9, 20, 0.45)',
        'glow-blood': '0 0 35px -5px rgba(255, 42, 54, 0.6)',
        'glow-amber': '0 0 25px -5px rgba(255, 176, 0, 0.4)',
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.4)',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.6' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(229, 9, 20, 0.8))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 5px rgba(229, 9, 20, 0.4))' },
        }
      },
      animation: {
        flicker: 'flicker 3s infinite',
        pulseGlow: 'pulseGlow 2s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
