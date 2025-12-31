module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        zembile: {
          yellow: '#FFD700',
          gray: '#2D2D2D'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
