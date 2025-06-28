/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        pulseSlow: 'pulseSlow 2s infinite ease-in-out',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.75' },
        },
      },
    },
  },
  plugins: [],
};