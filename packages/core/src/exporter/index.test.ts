import { expect, it } from "vitest";
import { MoodleExporter } from "./index";

it(
	"should export list attendees, and activities for one course",
	async (ctx) => {
		if (
			process.env.MOODLE_URL === undefined ||
			process.env.MOODLE_USERNAME === undefined ||
			process.env.MOODLE_PASSWORD === undefined
		) {
			ctx.skip();
			return;
		}

		const exporter = await MoodleExporter.init({
			base: process.env.MOODLE_URL,
			username: process.env.MOODLE_USERNAME,
			password: process.env.MOODLE_PASSWORD,
		});

		const list = await exporter.courses();
		expect(list).toBeInstanceOf(Array);
		// expect(list).toMatchSnapshot();

		for (let i = 0; i < 3; i++) {
			const attendees = await list[i].attendees();
			expect(attendees).toBeInstanceOf(Array);
			// expect(attendees).toMatchSnapshot();

			const activities = await list[i].activities();
			expect(activities).toBeInstanceOf(Object);
			// expect(activities).toMatchSnapshot();
		}

		expect(process.memoryUsage().rss).toBeLessThan(128 * 1024 * 1024);
	},
	{ timeout: 60_000 },
);
