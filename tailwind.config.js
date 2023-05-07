/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#281E18"
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false
  }
};
