/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kibo: {
          yellow: '#FFC107',
          'yellow-dark': '#E6A800',
          gray: '#4A4A4A',
          'gray-light': '#6B6B6B',
        }
      },
      animation: {
        'kibo-draw': 'kibo-draw 1.2s ease-out infinite',
      }
    },
  },
  plugins: [],
}
