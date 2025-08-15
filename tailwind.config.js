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
        'primary-light': 'var(--background-primary-light)',
        'secondary-light': 'var(--background-secondary-light)',
        'accent-light': 'var(--accent-light)',
        'text-primary-light': 'var(--text-primary-light)',
        'text-secondary-light': 'var(--text-secondary-light)',
        'border-color-light': 'var(--border-color-light)',

        'primary-dark': 'var(--background-primary-dark)',
        'secondary-dark': 'var(--background-secondary-dark)',
        'accent-dark': 'var(--accent-dark)',
        'text-primary-dark': 'var(--text-primary-dark)',
        'text-secondary-dark': 'var(--text-secondary-dark)',
        'border-color-dark': 'var(--border-color-dark)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
