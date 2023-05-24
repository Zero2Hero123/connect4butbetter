/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        'board': '1.08333333333'
      },
      keyframes: {
        insert: {
          '0%': { translate: '0px -300px' },
          '50%': { translate: '0px 0px' },
        },
        growIn: {
          '0%': {scale : '0'},
          '20%': {scale: '1.3'},
          '40%': {scale: '0.8', rotate: '380deg'},
          '60%': {scale: '0'},
          '100%': {scale: '0', }
        }
      },
      animation: {
        insertChip: 'insert 1s ease-in-out',
        growIn: 'growIn 4s ease-in-out forwards'
      }
    },
  },
  plugins: [],
}
