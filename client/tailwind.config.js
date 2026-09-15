/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F3F0EA',           // Warm Ivory
          hero: '#E7E1F5',         // Dusty Lavender
          card: '#FFFCF8',         // Soft White
          sidebar: '#243447',      // Deep Slate
          terracotta: '#D8A48F',   // Muted Terracotta
          sage: '#A8C3A0',         // Sage Green
          text: '#243447',         // Main Text
          muted: '#6B7280',        // Secondary Text
          border: '#E5DED2',       // Borders
          kanban: {
            todo: '#EFEBF8',
            progress: '#FDF0E9',
            review: '#FAF5E8',
            completed: '#EDF5EB',
          },
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(36, 52, 71, 0.04), 0 1px 3px rgba(36, 52, 71, 0.02)',
        card: '0 4px 20px -2px rgba(36, 52, 71, 0.06), 0 2px 6px -1px rgba(36, 52, 71, 0.03)',
        floating: '0 12px 32px -4px rgba(36, 52, 71, 0.12), 0 4px 12px -2px rgba(36, 52, 71, 0.06)',
      },
    },
  },
  plugins: [],
};
