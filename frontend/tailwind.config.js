/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Vite's entry point
    "./src/**/*.{js,ts,jsx,tsx}", // React component files
    "./src/*.{js,ts,jsx,tsx}", // React component files
  ],
  theme: {
    extend: {}, // Add custom themes or extend default configurations here
  },
  plugins: [], // Add any Tailwind plugins if needed
};