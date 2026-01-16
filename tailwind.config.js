/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: '#050505',      // Background Principal
        surface: '#121212',   // Cards/Modais
        primary: '#8A2BE2',   // Neon Purple
        accent: '#00F0FF',    // Electric Blue
        gold: '#FFD700',      // Premium/Diamond
        'gold-dark': '#B8860B',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.8) 50%, transparent 100%)',
      },
      boxShadow: {
        'neon-purple': '0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(138, 43, 226, 0.3)',
        'neon-blue': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-gold': '0 0 15px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(138, 43, 226, 0.6)' },
          '50%': { opacity: .7, boxShadow: '0 0 5px rgba(138, 43, 226, 0.3)' },
        }
      }
    },
  },
  plugins: [],
}