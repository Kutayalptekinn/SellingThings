/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
	theme: {
		extend: {
			boxShadow: {
				form: 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
			},
			colors: {
				primary: '#1F80C8',
				secondary: '#ADD8E6',
				tertiary: '#0F4C81',
				quaternary: '#2B72C3',
				subt: '#B1CEFF',
				prod: '#F2FFFF',
			},
		},
	},
  plugins: [],
}

