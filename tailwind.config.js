module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
    './common/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        narrow: ['Oswald', 'sans-serif'], // NOTE added this custom font-narrow
        base: ['Merriweather Sans', 'sans-serif'], // NOTE custom to cancel font-narrow
      },
      zIndex: {
        100: '100',
        110: '110',
        120: '120',
      },
      colors: {
        yellowgreen: {
          // NOTE example of adding custom colour
          DEFAULT: '#90ba00',
          50: '#f9fbf4',
          100: '#f4f8e8',
          200: '#e8f2d2',
          300: '#d3e3a4',
          400: '#a7c745',
          500: '#90ba00',
          600: '#79aa00',
          700: '#569400',
          800: '#186e00',
          900: '#002000',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')], // from common/
}
