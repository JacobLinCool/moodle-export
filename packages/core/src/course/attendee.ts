import { load } from "cheerio";
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

	const $ = load(html);
	const rows = $("tr[id^=user-index-participants][class='']").toArray();

	const attendees: Attendee[] = [];
	for (const row of rows) {
		const $row = $(row);
		const $name = $row.find("td.cell.c0");
		const $role = $row.find("td.cell.c1");
		const $group = $row.find("td.cell.c2");
		const $lastaccess = $row.find("td.cell.c3");

		attendees.push({
			name: $name.text(),
			img: $name.find("img").attr("src") ?? "",
			role: $role.text(),
			group: $group.text(),
			lastaccess: $lastaccess.text(),
		});
	}

	// release the memory
	$.root().empty();

	log("Fetched attendees", attendees);
	return attendees;
}
