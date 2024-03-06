/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('@navikt/ds-tailwind')],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
};
