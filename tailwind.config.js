/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#142c49',
          100: '#1a385c',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#173b78',
          900: '#08172b',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
}
