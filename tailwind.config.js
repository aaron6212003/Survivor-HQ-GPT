/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        survivor: {
          bg: "#0B0E14",
          card: "#121824",
          border: "#1E293B",
          alive: "#10B981",
          eliminated: "#EF4444",
          pending: "#F59E0B",
          locked: "#3B82F6",
          accent: "#22C55E",
        },
      },
    },
  },
  plugins: [],
};
