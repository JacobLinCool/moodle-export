import { expect, it } from "vitest";
import { login } from "./index";

it("should login", async (ctx) => {
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

	expect(true).toBe(true);
});
