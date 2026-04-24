/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f2',
          100: '#e3ebe0',
          200: '#c7d9c1',
          300: '#a3bf9a',
          400: '#80a573',
          500: '#5c8a4f',
          600: '#4a6e3f',
          700: '#3c5633',
          800: '#2d4127',
          900: '#1f2f1c',
        },
        terracotta: {
          50: '#fdf8f6',
          100: '#f9ede7',
          200: '#f2d9ce',
          300: '#e8bca9',
          400: '#d4957b',
          500: '#c4735a',
          600: '#a85a43',
          700: '#8c4835',
          800: '#733c2e',
          900: '#603128',
        },
        gold: {
          50: '#fdfaed',
          100: '#f9f0c7',
          200: '#f3e191',
          300: '#ebcc5c',
          400: '#e0b730',
          500: '#c49a20',
          600: '#9c791a',
          700: '#7c5e1a',
          800: '#684c1c',
          900: '#593f1c',
        },
        cream: {
          50: '#fefcf8',
          100: '#fdf7ef',
          200: '#faf0dc',
          300: '#f5e4c3',
          400: '#efd5a3',
          500: '#e7c27e',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};