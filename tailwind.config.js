/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#181818",
        darkPopup: "#1B1B1B",
        gray: "#242424",
        selectedBlue: "#00A3FF",
      },
      textColor: {
        lightGray: "#565656",
        dark: "#181818",
        selectedBlue: "#00A3FF",
      },
      borderColor: {
        "white-op": "rgba(255,255,255,0.5)",
        selectedBlue: "#00A3FF",
        "blue-primary": "#00A3FF",
      },
      boxShadow: {
        passBox: "4px 4px 20px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        ubuntu: "'Ubuntu', sans-serif",
        inter: "'Inter', sans-serif",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["group-hover"],
    },
  },
  plugins: [],
};
