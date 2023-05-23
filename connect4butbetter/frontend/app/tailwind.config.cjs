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
        }
      },
      animation: {
        insertChip: 'insert 1s ease-in-out'
      }
    },
  },
  plugins: [],
}
