/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#FC8019',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          500: '#FC8019',
          600: '#E96B0C',
          700: '#C2410C',
          dark: '#1C1C1C',
          muted: '#686B78',
          bg: '#FFFFFF',
          secondaryBg: '#F8F8F8',
          success: '#267E3E',
          border: '#E8E8E8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'float': '0 8px 30px rgba(252, 128, 25, 0.18)',
      }
    },
  },
  plugins: [],
}
