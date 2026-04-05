module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ["'Space Grotesk'", 'sans-serif'],
    },
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        cardBg: 'var(--cardBg)',
        cardBorder: 'var(--cardBorder)',
        accent: 'var(--accent)',
        accentHover: 'var(--accentHover)',
        accentGlow: 'var(--accentGlow)',
        positive: 'var(--positive)',
        negative: 'var(--negative)',
        textPrimary: 'var(--textPrimary)',
        textSecondary: 'var(--textSecondary)',
        textMuted: 'var(--textMuted)',
        chartBaseline: 'var(--chartBaseline)',
        chartScenario: 'var(--chartScenario)',
      }
    },
  },
  plugins: [],
}
