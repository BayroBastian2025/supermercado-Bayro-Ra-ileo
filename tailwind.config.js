/** @type {import('tailwindcss').Config} */
export default {
  // "content" activa el purge: en producción solo se incluyen las clases usadas.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Tema propio del supermercado (colores de marca reutilizables)
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
