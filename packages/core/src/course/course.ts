import { fetch_course_activities } from "./activity";
import { fetch_course_attendees } from "./attendee";
import type { ActivityMeta, ActivityType, Attendee, CourseListItem } from "./types";

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
	public async activities(): Promise<Record<string, Record<ActivityType, ActivityMeta[]>>> {
		return fetch_course_activities(this.fetch, this.base, this.meta.id);
	}
}
