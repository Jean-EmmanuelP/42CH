import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        'custom-color':'rgba(39, 42, 48, 0.01)'
      }
    },
  },
  plugins: [],
} satisfies Config;
