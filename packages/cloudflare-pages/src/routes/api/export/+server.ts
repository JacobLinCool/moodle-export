import { MoodleExporter, debug } from "moodle-export";
import type { RequestHandler } from "./$types";

interface ExportOptions {
	base: string;
	username?: string;
	password?: string;
	session?: string;
	filter?: string;
}

async function export_data(opt: ExportOptions) {
	if (!opt.base) {
		return new Response("Missing parameter: base", { status: 400 });
	}

	const { base, username, password, session } = opt;

	let exporter: MoodleExporter;
	if (session) {
		exporter = await MoodleExporter.init({ base, session });
	} else {
		if (!username || !password) {
			return new Response("Missing parameter: username or password", { status: 400 });
		}
		exporter = await MoodleExporter.init({ base, username, password });
	}

	const log = debug("export");
	log.enabled = true;
	log("Exporting");
	const courses = await exporter.courses();
	const result = await Promise.all(
		courses
			.filter((c) => {
				if (!opt.filter) {
					return true;
				}

				return c.meta.fullname.toLowerCase().includes(opt.filter.trim().toLowerCase());
			})
			.map(async (course) => {
				const attendees = await course.attendees();
				const activities = await course.activities();
				return {
					...course.meta,
					attendees,
					activities,
				};
			}),
	);
	log("Exported");

	return new Response(JSON.stringify(result), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export const GET = (async ({ url }) => {
	const base = url.searchParams.get("base") ?? "";
	const username = url.searchParams.get("username") ?? undefined;
	const password = url.searchParams.get("password") ?? undefined;
	const session = url.searchParams.get("session") ?? undefined;
	const filter = url.searchParams.get("filter") ?? undefined;

	return export_data({ base, username, password, session, filter });
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	if (!request.body) {
		return new Response("Missing body", { status: 400 });
	}

	const { base, username, password, session, filter } = await request.json();

	return export_data({ base, username, password, session, filter });
}) satisfies RequestHandler;
