/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.slick-dots': {
          'bottom': '-30px',
          '@screen sm': {
            'bottom': '-40px',
          },
        },
        '.slick-dots li button:before': {
          'font-size': '8px',
          'color': '#4fd1c5',
        },
        '.slick-dots li.slick-active button:before': {
          'color': '#2c7a7b',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}