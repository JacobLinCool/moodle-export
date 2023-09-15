import { Activity, ResourceActivity, UrlActivity } from "../activity";
import { fetch_course_activities } from "./activity";
import { fetch_course_attendees } from "./attendee";
import type { Attendee, CourseListItem, Section } from "./types";

/**
 * Represents a course in the Moodle.
 */
export class Course {
	constructor(
		protected fetch: typeof globalThis.fetch,
		protected base: string,
		public meta: CourseListItem,
	) {}

	/**
	 * Retrieves the attendees for the course.
	 * @returns An array of Attendee objects.
	 */
	public attendees(): Promise<Attendee[]> {
		return fetch_course_attendees(this.fetch, this.meta.viewurl, this.meta.id);
	}

	/**
	 * Retrieves all activities in the course, grouped by section name and activity type.
	 * @returns Each section name is a key in the returned object. Each section name maps to an object with activity types as keys. Each activity type maps to an array of activities.
	 */
	public async activities(): Promise<Record<string, Section>> {
		const activities = await fetch_course_activities(this.fetch, this.base, this.meta.id);

		const sections: Record<string, Section> = {};
		for (const [section, group] of Object.entries(activities)) {
			sections[section] = {};
			for (const [type, meta] of Object.entries(group)) {
				if (type === "resource") {
					sections[section][type] = meta.map((m) => new ResourceActivity(this.fetch, m));
				} else if (type === "url") {
					sections[section][type] = meta.map((m) => new UrlActivity(this.fetch, m));
				} else if (
					type === "assign" ||
					type === "forum" ||
					type === "quiz" ||
					type === "choice" ||
					type === "folder"
				) {
					sections[section][type] = meta.map((m) => new Activity(this.fetch, m));
				}
			}
		}

		return sections;
	}
}
