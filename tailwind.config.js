/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        surface: '#1E1E1E',
        primary: '#FF4D4D',
        secondary: '#A0A0A0',
      },
    },
  },
  plugins: [],
}