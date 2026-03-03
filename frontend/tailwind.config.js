/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Brand colors (use Tailwind's built-in slate/emerald for grays) ──────
      colors: {
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',  // primary action
          700: '#15803d',  // hover
          800: '#166534',
          900: '#14532d',
          950: '#052e16',  // dark-mode deep bg accent
        },
      },

      // ── Border radius ──────────────────────────────────────────────────────
      borderRadius: {
        '2xl': '1rem',    // 16 px – standard card
        '3xl': '1.5rem',  // 24 px – modals, large panels
      },

      // ── Shadows ────────────────────────────────────────────────────────────
      boxShadow: {
        // Neutral depth
        soft:       '0 2px 8px -1px rgba(0,0,0,.06), 0 1px 4px -1px rgba(0,0,0,.04)',
        // Green-tinted lift (hover state)
        elevated:   '0 8px 24px -4px rgba(22,163,74,.14), 0 4px 8px -2px rgba(22,163,74,.08)',
        // Focus ring supplement
        glow:       '0 0 0 3px rgba(22,163,74,.20)',
        // Outer glow for icons / badges
        'glow-lg':  '0 4px 20px rgba(22,163,74,.25)',
        // Frosted glass card (light)
        glass:      '0 8px 32px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.8)',
        // Frosted glass card (dark)
        'dark-glass':'0 8px 32px rgba(0,0,0,.4),  inset 0 1px 0 rgba(255,255,255,.05)',
      },

      // ── Animations ─────────────────────────────────────────────────────────
      animation: {
        'fade-up':    'fadeUp   .35s cubic-bezier(.16,1,.3,1) both',
        'scale-in':   'scaleIn  .25s cubic-bezier(.16,1,.3,1) both',
        'slide-down': 'slideDown .2s ease-out both',
        shimmer:      'shimmer  1.6s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity:'0', transform:'translateY(10px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        scaleIn:   { from: { opacity:'0', transform:'scale(.95)' },       to: { opacity:'1', transform:'scale(1)' } },
        slideDown: { from: { opacity:'0', transform:'translateY(-6px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        shimmer:   { to:   { backgroundPosition:'200% center' } },
      },

      // ── Misc ───────────────────────────────────────────────────────────────
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}