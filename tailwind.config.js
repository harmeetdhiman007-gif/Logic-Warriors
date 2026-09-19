/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#131921',
          light: '#232f3e',
          yellow: '#febd69',
          orange: '#f08804',
          blue: '#007185',
        },
        flipkart: {
          blue: '#2874f0',
          yellow: '#ffe500',
          dark: '#172337',
        },
        warrior: {
          primary: '#2563eb',
          secondary: '#f59e0b',
          accent: '#10b981',
          dark: '#0f172a',
          card: '#1e293b',
        }
      },
    },
  },
  plugins: [],
}
