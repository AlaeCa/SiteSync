/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        bgGlobal: '#F4F7F9',
        surfaceCard: '#FFFFFF',
        textMain: '#111827',
        textMuted: '#4B5563',
        urgentBg: '#DC2626',
        mediumBg: '#E67E22',
        routineBg: '#4A5568',
      },
    },
  },
  plugins: [],
}
