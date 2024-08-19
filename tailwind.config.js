/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'calendar-hover':'#fef9c3'
      }
    },
  },
  plugins: [],
}