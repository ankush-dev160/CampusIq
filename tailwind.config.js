/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme variables (dynamically switches between Dark & Light themes)
        theme: {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          secondary: 'var(--bg-secondary)',
          border: 'var(--border-subtle)',
          borderGlass: 'var(--border-glass)',
          borderHover: 'var(--border-hover)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          subtle: 'var(--text-muted)',
          accent: 'var(--accent-primary)',
          accentHover: 'var(--accent-primary-hover)',
          accentMuted: 'var(--accent-primary-muted)',
          accentBorder: 'var(--accent-primary-border)',
          accentText: 'var(--accent-text)',
          accentCyan: 'var(--accent-cyan)',
          accentSecondary: 'var(--accent-secondary)',
          accentHighlight: 'var(--accent-highlight)',
        },
        // Core aliases
        page: 'var(--bg-primary)',
        panel: 'var(--bg-surface)',
        raised: 'var(--bg-elevated)',
        border: 'var(--border-subtle)',
        // Status colors
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-error)',
          error: 'var(--status-error)',
          green: 'var(--status-success)',
          red: 'var(--status-error)',
          amber: 'var(--status-warning)',
          info: 'var(--status-info)',
          grey: 'var(--text-secondary)',
        },
        // Professional blue and teal/green aliases
        blue: {
          primary: 'var(--accent-primary)',
          royal: '#014BAA',
        },
        teal: {
          mint: '#2AF5C8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'panel-gradient': 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))',
        'btn-primary': 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
      },
      boxShadow: {
        'spatial': 'var(--shadow-spatial)',
        'card': 'var(--card-shadow)',
        'glow-accent': '0 0 20px var(--accent-primary-border)',
        'glow-cyan': '0 0 20px var(--accent-cyan-border)',
      },
    },
  },
  plugins: [],
}
