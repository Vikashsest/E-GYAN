/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    // TEXT
    "text-lightGreen",
    "text-lightYellow",
    "text-lightBlue",
    "text-lightRed",
    "text-primaryRed",
    "text-primaryBlack",
    "text-primaryWhite",
    "text-primaryBlue",
    "text-primaryOrange",
    "text-primaryGreen",
    "text-primaryYellow",
    "text-mutedText",

    // BG
    "bg-sidebarbg",
    "bg-primaryBlue",
    "bg-primaryOrange",
    "bg-primaryGreen",
    "bg-primaryYellow",
    "bg-notificationRed",

    // HOVER BG
    "hover:bg-hoverGray",
    "hover:bg-hoverBlue",
    "hover:bg-primaryOrange",
    "hover:bg-primaryGreen",
    "hover:bg-primaryYellow",

    // BORDER
    "border-primaryBlue",
    "border-primaryOrange",
    "border-primaryGreen",
    "border-primaryYellow",

    // HOVER BORDER
    "hover:border-primaryBlue",
    "hover:border-primaryOrange",
    "hover:border-primaryGreen",
    "hover:border-primaryYellow",

    // TEXT HOVER
    "hover:text-primaryBlue",
    "hover:text-primaryOrange",
    "hover:text-primaryGreen",
    "hover:text-primaryYellow",
  ],

  theme: {
    extend: {
      colors: {
        primaryBlack: "#000000",
        primaryWhite: "#ffffff",
        primaryBlue: "#2563eb",
        lightBlue: "#3b82f6",
        hoverBlue: "#1d4ed8",
        hoverGray: "#343545",
        primaryRed: "#dc2626",
        lightRed: "#f87171",
        primaryOrange: "#f97316",
        primaryGreen: "#22c55e",
        lightGreen: "#4ade80",
        primaryYellow: "#eab308",
        lightYellow: "#fde047",
        sidebarbg: "#15161e",

        gray400: "#9ca3af",
        gray500: "#6b7280",
        gray700: "#374151",
        gray300: "#d1d5db",
        gray600: "#4b5563",
        gray200:"#e5e7eb",
        gray800:"#1f2937",
        purple500:"#a855f7",
        indigo600:"#4f46e5",
        darkBg: "#1e1f2b",
        cardBg: "#2a2b39",
        darkRed:"#dc2626"
      },
    },
  },

  plugins: [],
};
