import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["dotenv/config"],
		// browser: {
		// 	provider: "playwright",
		// 	enabled: true,
		// 	name: "chromium",
		// 	headless: true,
		// },
	},
});
