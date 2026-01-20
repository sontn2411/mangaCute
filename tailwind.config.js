/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Manual or System control
  theme: {
    extend: {
      colors: {
        // Kawaii Palette
        primary: '#FF9EB5',       // Sakura Pink (Light Default)
        'primary-dark': '#FF7A9A', // Dark mode Primary

        background: '#FFF0F5',    // Lavender Blush (Light BG)
        'background-dark': '#1A1625', // Deep Violet (Dark BG)

        surface: '#FFFFFF',       // Card BG (Light)
        'surface-dark': '#2F2B3A', // Card BG (Dark Plum)

        text: '#4A4A4A',          // Text Main (Light)
        'text-dark': '#E6E1F4',   // Text Main (Dark)

        border: '#FFE4E1',
        'border-dark': '#403850',
      }
    },
  },
  plugins: [],
}