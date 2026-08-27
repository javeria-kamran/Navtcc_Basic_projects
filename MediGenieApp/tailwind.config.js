/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGrey: "#1a1a1a",
        lightGrey: "#d1d5db",
        blue1: "#3b82f6",
      },
      fontFamily: {
        poppins: ["Poppins-Regular"],
        poppinsBold: ["Poppins-Bold"],
        poppinsRegular: ["Poppins-Regular"],
      },
    },
  },
  plugins: [],
};
