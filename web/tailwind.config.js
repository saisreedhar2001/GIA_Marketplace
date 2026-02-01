/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian-inspired palette
        terracotta: '#B85C3C',
        indigo: '#312653',
        'sand-beige': '#E8DCC4',
        'deep-green': '#2D5016',
        'off-white': '#FFFBF7',
        'warm-gray': '#9B8B7E',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Libre Baskerville', 'Georgia', 'serif'],
        sans: ['Inter', 'Lato', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'kolam-pattern': "url('data:image/svg+xml,...')",
      },
    },
  },
  plugins: [],
}
