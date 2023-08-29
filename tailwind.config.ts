import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 
    'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8', 
    'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12', 
    'grid-rows-1', 'grid-rows-2', 'grid-rows-3', 'grid-rows-4', 
    'grid-rows-5', 'grid-rows-6', 'grid-rows-7', 'grid-rows-8', 
    'grid-rows-9', 'grid-rows-10', 'grid-rows-11', 'grid-rows-12',
    'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-7', 
    'py-8', 'py-9', 'py-10', 'py-11', 'py-12', 'py-14', 'py-16', 
    'py-20', 'py-24', 'py-28', 'py-32', 'py-36', 'py-40', 'py-44', 
    'py-48', 'py-52', 'py-56', 'py-60', 'py-64'
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-color':'rgba(39, 42, 48, 0.01)'
      }
    },
  },
  plugins: [],
};
