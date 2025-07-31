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
      fontSize: {
        // 覆蓋 text-base 為 18px，保持全站字體一致性
        'base': ['18px', '1.75rem'],
      },
      container: {
        center: true,
        padding: '0',
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