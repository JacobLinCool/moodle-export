import { Semaphore } from "async-mutex";
import { MoodleExporter } from "moodle-export";

interface ExportOptions {
	base: string;
	username?: string;
	password?: string;
	session?: string;
	filter?: string;
}

export async function export_data(opt: ExportOptions) {
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

	const tag = `export:${base}:${username ?? session ?? "anonymous"}`;
	let start = Date.now();
	console.log(`[${tag}]`, "Exporting courses");
	const courses = await exporter.courses();

	const sem = new Semaphore(2);

	const result = await Promise.all(
		courses
			.filter((c) => {
				if (!opt.filter) {
					return true;
				}

				return c.meta.fullname.toLowerCase().includes(opt.filter.trim().toLowerCase());
			})
			.map(async (course) => {
				const [, release] = await sem.acquire();
				console.log(`[${tag}]`, `Exporting ${course.meta.fullname}`);
				const attendees = await course.attendees();
				const activities = await course.activities();
				console.log(`[${tag}]`, `Exported ${course.meta.fullname}`);
				release();
				return {
					...course.meta,
					attendees,
					activities,
				};
			}),
	);
	console.log(`[${tag}]`, `Exported ${result.length} courses in ${Date.now() - start}ms`);

	return new Response(JSON.stringify(result), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
