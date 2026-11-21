/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090A0B',
        'secondary-bg': '#151319',
        plum: '#30213D',
        'plum-dark': '#201429',
        sage: '#A2B091',
        violet: '#8844C9',
        gold: '#B97B34',
        'gold-muga': '#D4AF37',
        'text-primary': '#DADCD3',
        'text-muted': '#9A9E96',
        'gamusa-red': '#D92534'
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        editorial: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'halo-glow': '0 0 40px -10px rgba(136, 68, 201, 0.25)',
        'gold-glow': '0 0 30px -5px rgba(185, 123, 52, 0.25)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)'
      }
    },
  },
  plugins: [],
}
