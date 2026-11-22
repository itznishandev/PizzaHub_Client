/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pizza: {
          red: "#c83e2b",
          orange: "#e07a2e",
          cream: "#fffbf5",
        },
      },
    },
  },
  plugins: [],
};
