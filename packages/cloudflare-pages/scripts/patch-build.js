import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const target = path.join(__dirname, "../node_modules/@sveltejs/adapter-cloudflare/index.js");
const content = fs.readFileSync(target, "utf8");

const should_path = content.includes(`external: ['cloudflare:*']`);
if (should_path) {
	const patched = content.replace(
		`external: ['cloudflare:*']`,
		`external: ['cloudflare:*', 'tty', 'util', 'os', 'punycode']`,
	);
	fs.writeFileSync(target, patched);
	console.log("Patched @sveltejs/adapter-cloudflare/index.js");
}
