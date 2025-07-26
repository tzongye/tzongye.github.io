/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // 自定義專案色彩
        primary: {
          50: '#f8fafc',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        }
      },
      scrollMargin: {
        '20': '5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
  // 保留重要的動態 class
  safelist: [
    'bg-blue-500',
    'bg-emerald-500', 
    'bg-amber-500',
    'bg-purple-500'
  ]
}