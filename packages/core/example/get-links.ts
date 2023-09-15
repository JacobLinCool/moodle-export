import { config } from "dotenv";
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
	console.log(`Getting links for ${course.meta.shortname}`);
	const activities = await course.activities();
	for (const [section_name, section] of Object.entries(activities)) {
		if (section.url) {
			console.log(`    Getting links for section ${section_name}`);
			for (const url of section.url) {
				try {
					const dest = await url.resolve();
					console.log(`        [${url.meta.name}] ${url.meta.url} -> ${dest}`);
				} catch (e) {
					console.log(`        [${url.meta.name}] ${url.meta.url} has invalid link`);
				}
			}
		} else {
			console.log(`    No links for section ${section_name}`);
		}
	}
}
