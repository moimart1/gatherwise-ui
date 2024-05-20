export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      fontFamily: {
        narrow: ['Oswald', 'sans-serif'], // NOTE added this custom font-narrow
        base: ['Inter', 'sans-serif'], // NOTE custom to cancel font-narrow
      },
      fontSize: {
        '2xs': [
          '0.5rem',
          {
            lineHeight: '0.8rem',
            letterSpacing: '-0.01em',
            fontWeight: '100',
          },
        ],
      },
      zIndex: {
        100: '100',
        110: '110',
        120: '120',
      },
      colors: {
        front: {
          DEFAULT: '#efa304',
        },
        back: {
          DEFAULT: '#191919',
        },
        'status-red': {
          // from https://www.tailwindshades.com
          DEFAULT: '#D3212C',
          50: '#F4B8BB',
          100: '#F1A6AB',
          200: '#EC8389',
          300: '#E66068',
          400: '#E13C46',
          500: '#D3212C',
          600: '#A21922',
          700: '#721218',
          800: '#410A0E',
          900: '#110304',
        },
        'status-yellow': {
          DEFAULT: '#FF980E',
          50: '#FFE6C6',
          100: '#FFDEB1',
          200: '#FFCC88',
          300: '#FFBB60',
          400: '#FFA937',
          500: '#FF980E',
          600: '#D57A00',
          700: '#9D5A00',
          800: '#653A00',
          900: '#2D1A00',
        },
        'status-green': {
          DEFAULT: '#08AF04',
          50: '#A2FDA0',
          100: '#72FC6E',
          200: '#63FB5F',
          300: '#16F411',
          400: '#0AD705',
          500: '#08AF04',
          600: '#057803',
          700: '#034101',
          800: '#000A00',
          900: '#000000',
        },
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
        midnight: {
          DEFAULT: '#001B44',
          50: '#f9fafb',
          100: '#e5e8ec',
          200: '#ccd1d9',
          300: '#b2bac6',
          400: '#99a3b4',
          500: '#7f8da1',
          600: '#66768e',
          700: '#4c5f7c',
          800: '#324869',
          900: '#193156',
          950: '#001B44',
        },
      },
      keyframes: {
        indeterminate: {
          '0%': {
            transform: 'translateX(0) scaleX(0)',
          },
          '20%': {
            transform: 'translateX(0) scaleX(0.4)',
          },
          '100%': {
            transform: 'translateX(100%) scaleX(0.4)',
          },
        },
      },
      animation: {
        indeterminate: 'indeterminate 1s infinite linear',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
}
