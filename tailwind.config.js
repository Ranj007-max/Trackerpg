/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode using a class
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'primary-light': '#FFFFFF',
        'secondary-light': '#F0F2F5',
        'accent-light': '#4A90E2',
        'text-primary-light': '#1F2937',
        'text-secondary-light': '#6B7280',

        // Dark theme colors
        'primary-dark': '#1A1A1A',
        'secondary-dark': '#2A2A2A',
        'accent-dark': '#63B3ED',
        'text-primary-dark': '#E5E7EB',
        'text-secondary-dark': '#9CA3AF',

        cyan: colors.cyan,
        fuchsia: colors.fuchsia,
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
