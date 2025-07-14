// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Caminho correto para seus arquivos
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
