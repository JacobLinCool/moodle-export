import { parse } from "node-html-parser";
import { ext } from "../debug";
import type { Attendee } from "./types";

const log = ext("course-attendee");

/**
 * Fetches the attendees of a course with the given ID from the specified base URL.
 * @param fetch - The `fetch` function to use for making HTTP requests.
 * @param base - The base URL of the Moodle site.
 * @param id - The ID of the course to fetch attendees for.
 * @returns An array of `Attendee` objects.
 */
export async function fetch_course_attendees(
	fetch: typeof globalThis.fetch,
	base: string,
	id: number,
) {
	const url = new URL(base);
	url.pathname = "/user/index.php";
	url.searchParams.set("id", id.toString());
	url.searchParams.set("perpage", "5000");
	log("Fetching attendees", url);

	const res = await fetch(url);
	const html = await res.text();
	log("Fetched response", html);

	const root = parse(html);
	const participants = root.querySelectorAll("tr[id^=user-index-participants][class='']");

	const attendees: Attendee[] = [];
	for (const participant of participants) {
		const elm_name = participant.querySelector("td.cell.c0");
		const elm_role = participant.querySelector("td.cell.c1");
		const elm_group = participant.querySelector("td.cell.c2");
		const elm_lastaccess = participant.querySelector("td.cell.c3");

		attendees.push({
			name: elm_name?.text || "",
			img: elm_name?.querySelector("img")?.getAttribute("src") || "",
			role: elm_role?.text || "",
			group: elm_group?.text || "",
			lastaccess: elm_lastaccess?.text || "",
		});
	}

	log("Fetched attendees", attendees);
	return attendees;
}
