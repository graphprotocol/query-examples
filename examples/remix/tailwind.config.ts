import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Fira\\ Mono', 'ui-monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
