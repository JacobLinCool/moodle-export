import { config } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { MoodleExporter } from "../src";

config();

const exporter = await MoodleExporter.init({
	base: process.env.MOODLE_URL!,
	username: process.env.MOODLE_USERNAME!,
	password: process.env.MOODLE_PASSWORD!,
});
console.log("Initialized exporter");

const courses = await exporter.courses();
for (const course of courses) {
	console.log(`Downloading files for ${course.meta.shortname}`);
	const activities = await course.activities();
	for (const [section_name, section] of Object.entries(activities)) {
		if (section.resource) {
			console.log(`    Downloading files for section ${section_name}`);
			for (const resource of section.resource) {
				const filename = await resource.filename();
				const file = await resource.download();
				const dir = path.join("exported", course.meta.shortname, section_name);
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir, { recursive: true });
				}
				fs.writeFileSync(path.join(dir, filename), Buffer.from(file));
				console.log(`        Downloaded ${filename}`);
			}
		} else {
			console.log(`    No files for ${section_name}`);
		}
	}
}
