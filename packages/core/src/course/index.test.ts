import { expect, it } from "vitest";
import { login } from "../auth";
import { fetch_course_list } from "./index";

it(
	"should fetch list attendees, and activities for one course",
	async (ctx) => {
		if (
			process.env.MOODLE_URL === undefined ||
			process.env.MOODLE_USERNAME === undefined ||
			process.env.MOODLE_PASSWORD === undefined
		) {
			ctx.skip();
			return;
		}

		const fetch = await login(
			process.env.MOODLE_URL,
			process.env.MOODLE_USERNAME,
			process.env.MOODLE_PASSWORD,
		);

		const list = await fetch_course_list(fetch, process.env.MOODLE_URL);
		expect(list).toBeInstanceOf(Array);
		// expect(list).toMatchSnapshot();

		const attendees = await list[0].attendees();
		expect(attendees).toBeInstanceOf(Array);
		// expect(attendees).toMatchSnapshot();

		const activities = await list[0].activities();
		expect(activities).toBeInstanceOf(Object);
		// expect(activities).toMatchSnapshot();
	},
	{ timeout: 60_000 },
);
