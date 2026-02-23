/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#c9a96e',
                    dark: '#b09055',
                    light: '#dfc08e',
                },
                navy: '#1a2744',
                brand: {
                    navy: '#1a2744',
                    'navy-light': '#243561',
                },
            },
            fontFamily: {
                serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
                sans: [
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                ],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
