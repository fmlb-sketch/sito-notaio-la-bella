/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#22334C',
        navyDeep: '#182636',
        mist: '#B7BAC2',
        line: '#D8D6D0',
        paper: '#F6F3EE',
        paperDeep: '#EFEBE3',
        ink: '#1D1D1B',
        inkSoft: '#5B5B57',
        offwhite: '#FBFAF7',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
