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
          DEFAULT: '#e8e8f4',
          muted:   '#7878a0',
          faint:   '#44445e',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          alt:     '#191929',
        },
        line:   '#1f1f33',
        accent: {
          DEFAULT: '#4d8ef0',
          hover:   '#60a5fa',
          light:   '#0c1b3d',
        },
        sff: {
          green:  '#34d399',
          amber:  '#fbbf24',
          red:    '#f87171',
        },
      },
      maxWidth: {
        content: '1200px',
        prose:   '720px',
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config
