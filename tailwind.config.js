/** @type {import('tailwindcss').Config} */
module.exports = {
  // CRITICAL: This must list all file paths where you use Tailwind classes.
  content: [
    // Standard Next.js paths for App Router and Components
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Add custom settings here (e.g., custom colors, fonts)
    },
  },
  plugins: [],
}