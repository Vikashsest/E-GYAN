/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-primaryWhite",
    "text-primaryBlue",
    "text-primaryOrange",
    "text-primaryGreen",
    "text-primaryYellow",

    "bg-primaryBlue",
    "bg-primaryOrange",
    "bg-primaryGreen",
    "bg-primaryYellow",
  ],
  theme: {
    extend: {
      colors: {
        primaryWhite:"#ffffff",
        primaryBlue: "#3b82f6",
        primaryOrange: "#f97316",
        primaryGreen: "#22c55e",
        primaryYellow: "#eab308",

        gray400: "#9ca3af",
        gray500: "#6b7280",
        gray700: "#374151",

        darkBg: "#1e1f2b",
        cardBg: "#2a2b39",
      },
    },
  },
  plugins: [],
};
