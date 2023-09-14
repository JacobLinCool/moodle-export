import { load } from "cheerio";
import { Course } from "./course";
import type { CourseListItem } from "./types";

/**
 * Fetches a list of enrolled courses by timeline.
 * @param fetch - The fetch function to use for making HTTP requests.
 * @param base - The base URL of the Moodle site.
 * @returns An array of Course objects.
 */
export async function fetch_course_list(
	fetch: typeof globalThis.fetch,
	base: string,
): Promise<Course[]> {
	const sesskey = await get_sesskey(fetch, base);

	const url = new URL(base);
	url.pathname = "/lib/ajax/service.php";
	url.searchParams.set("sesskey", sesskey);
	url.searchParams.set("info", "core_course_get_enrolled_courses_by_timeline_classification");

	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify([
			{
				index: 0,
				methodname: "core_course_get_enrolled_courses_by_timeline_classification",
				args: {
					offset: 0,
					limit: 48,
					classification: "all",
					sort: "visible DESC,sortorder ASC",
				},
			},
		]),
	});

	const json = await res.json();

	return json[0].data.courses.map((course: CourseListItem) => new Course(fetch, base, course));
}

export async function get_sesskey(fetch: typeof globalThis.fetch, base: string): Promise<string> {
	const url = new URL(base);
	url.pathname = "/my";

	const res = await fetch(url);
	const html = await res.text();

	const $ = load(html);
	const sesskey = $("input[name=sesskey]").attr("value");
	if (!sesskey) {
		throw new Error("Could not get sesskey");
	}

	return sesskey;
}
