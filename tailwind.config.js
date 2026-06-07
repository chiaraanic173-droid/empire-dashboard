/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#1A1714',
        gold: '#C9A84C',
        'gold-light': '#E8C97A',
        'gold-dim': '#8A6E2F',
        rose: '#C4726A',
        'rose-light': '#E09590',
        'rose-dim': '#7A3F3A',
        violet: '#7B5EA7',
        'violet-light': '#A688D4',
        'violet-dim': '#4A3466',
        cream: '#FAF7F2',
        'card-bg': '#211E1A',
        'card-hover': '#2A2622',
        border: '#2E2A25',
        muted: '#6B6560',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease',
        'slide-up': 'slideUp 0.3s ease',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
    },
  },
  plugins: [],
};
