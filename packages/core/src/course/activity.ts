import { load } from "cheerio";
import { ext } from "../debug";
import type { ActivityMeta, ActivityType } from "./types";

const log = ext("course-activity");

/**
 * Fetches the activities of a course from Moodle.
 * @param fetch - The fetch function to use.
 * @param base - The base URL of the Moodle site.
 * @param id - The ID of the course to fetch activities for.
 * @returns An object containing the activities grouped by section and type.
 */
export async function fetch_course_activities(
	fetch: typeof globalThis.fetch,
	base: string,
	id: number,
): Promise<Record<string, Record<ActivityType, ActivityMeta[]>>> {
	const url = new URL(base);
	url.pathname = "/course/view.php";
	url.searchParams.set("id", id.toString());
	log("Fetching activities", url);

	const res = await fetch(url);
	const html = await res.text();
	const $ = load(html);
	log("Fetched response", html);

	const result: Record<string, Record<ActivityType, ActivityMeta[]>> = {};

	const sections = $("[id^=section]").toArray();
	for (const section of sections) {
		const section_name = $(section).find("h3.sectionname").text();

		const activity: Record<ActivityType, ActivityMeta[]> = {
			assign: [],
			forum: [],
			quiz: [],
			url: [],
			choice: [],
			folder: [],
		};

		const types: ActivityType[] = ["assign", "forum", "quiz", "url", "choice", "folder"];
		for (const type of types) {
			const $activity = $(section).find(`[id^=module].${type}`);
			const activities: ActivityMeta[] = [];

			for (const item of $activity.toArray()) {
				const $item = $(item);
				const name = $item.find(".activityinstance").text();
				const url = $item.find(".activityinstance a").attr("href") ?? "";

				const $contentafterlink = $item.find(".contentafterlink");
				const contentafterlink =
					$contentafterlink.length > 0 ? $contentafterlink.text() : undefined;

				activities.push({ name, url, contentafterlink });
			}

			activity[type] = activities;
		}

		if (Object.values(activity).some((a) => a.length > 0)) {
			result[section_name] = activity;
		}
	}

	log("Fetched activities", result);
	return result;
}
