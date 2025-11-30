/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./views/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./App.tsx"
    ],
    darkMode: 'class', // Enable dark mode via class
    theme: {
        extend: {
            colors: {
                // Custom colors if needed, but we rely mostly on CSS variables
            },
            minHeight: {
                'tg-screen': 'var(--tg-viewport-height, 100vh)',
            }
        },
    },
    plugins: [],
}
