import { parse } from "node-html-parser";
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
): Promise<Record<string, Partial<Record<ActivityType, ActivityMeta[]>>>> {
	const url = new URL(base);
	url.pathname = "/course/view.php";
	url.searchParams.set("id", id.toString());
	log("Fetching activities", url);

	const res = await fetch(url);
	const html = await res.text();
	const root = parse(html);
	log("Fetched response", html);

	const result: Record<string, Partial<Record<ActivityType, ActivityMeta[]>>> = {};

	const sections = root.querySelectorAll("[id^=section]");
	for (const section of sections) {
		const section_name = section.querySelector("h3.sectionname")?.text || "";

		const activity: Partial<Record<ActivityType, ActivityMeta[]>> = {};

		const types: ActivityType[] = [
			"assign",
			"forum",
			"quiz",
			"url",
			"choice",
			"folder",
			"resource",
		];
		for (const type of types) {
			const elm_items = section.querySelectorAll(`[id^=module].${type}`);
			const activities: ActivityMeta[] = [];

			for (const item of elm_items) {
				const name = item.querySelector(".activityinstance")?.text || "";
				const url = item.querySelector(".activityinstance a")?.getAttribute("href") || "";

				const elm_contentafterlink = item.querySelector(".contentafterlink");
				const contentafterlink = elm_contentafterlink?.text ?? undefined;

				activities.push({ name, url, contentafterlink });
			}

			if (activities.length > 0) {
				activity[type] = activities;
			}
		}

		if (Object.keys(activity).length > 0) {
			result[section_name] = activity;
		}
	}

	log("Fetched activities", result);
	return result;
}
