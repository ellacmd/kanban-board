/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#635FC7',
                    light: '#A8A4FF',
                },
                dark: {
                    DEFAULT: '#000112',
                    secondary: '#20212C',
                },
                gray: {
                    dark: '#2B2C37',
                    medium: '#3E3F4E',
                    light: '#828FA3',
                },
                soft: {
                    lightest: '#E4EBFA',
                    light: '#F4F7FD',
                    white: '#FFFFFF',
                },
                danger: {
                    DEFAULT: '#EA5555',
                    light: '#FF9898',
                },
            },
        },
    },
    plugins: [],
};
