/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0D0D10", // near-black / charcoal background
        surface: "#18181D", // dark grey surface
        surfaceHover: "#22222A",
        surfaceBorder: "#2E2E38",
        primary: "#CCFF00", // electric lime
        primaryDark: "#A3CC00",
        gold: "#E5A93C", // restrained gold for PR highlights
        goldMuted: "#966E26",
        textPrimary: "#F4F4F6", // off-white
        textSecondary: "#9E9EA8", // muted grey
        textMuted: "#6B6B78",
        danger: "#EF4444",
        success: "#22C55E",
        crimson: "#D81E3C",
        crimsonDark: "#B3142D",
        coral: "#EF5A30",
        flame: "#FC8138",
        ink: "#111216",
      },
    },
  },
  plugins: [],
};
