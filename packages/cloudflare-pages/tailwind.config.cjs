/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.svelte", "./src/**/*.html", "./src/**/*.css"],
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
