import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"',
          '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif',
        ],
      },
      colors: {
        ink: {
          DEFAULT: '#1d1d1f',
          muted:   '#6e6e73',
          faint:   '#86868b',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt:     '#f5f5f7',
        },
        line:   '#d2d2d7',
        accent: {
          DEFAULT: '#0071e3',
          hover:   '#0077ed',
          light:   '#e8f0fb',
        },
        sff: {
          // Brand accent for SFF-specific UI
          green:  '#00c48c',
          amber:  '#f5a623',
          red:    '#ff3b30',
        },
      },
      maxWidth: {
        content: '1200px',
        prose:   '720px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config
