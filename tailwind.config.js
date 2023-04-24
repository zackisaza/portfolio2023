/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#060606",
        secondary: "#dedcca",
        tertiary: "#e3b11b",
        "black-100": "#25210d",
        "black-200": "#261903",
        "white-100": "#fff", 
        "white-200": "#f2f2f2"
        
      },
      boxShadow: {
        card: "0px 35px 120px -15px #332d1c",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },
    },
  },
  plugins: [],
};