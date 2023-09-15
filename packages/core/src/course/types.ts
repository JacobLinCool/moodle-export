/**
 * Represents a single course item with its metadata.
 */
export interface CourseListItem {
	/** Category to which the course belongs. */
	coursecategory: string;
	/** URL of the course's associated image. */
	courseimage: string;
	/** Unix timestamp representing the end date of the course. */
	enddate: number;
	/** Full name of the course. */
	fullname: string;
	/** Display-friendly version of the course's full name. */
	fullnamedisplay: string;
	/** Indicates if the course has progress tracking. */
	hasprogress: boolean;
	/** Indicates if the course is hidden. */
	hidden: boolean;
	/** Unique identifier for the course. */
	id: number;
	/** Additional identifier for the course (might be alphanumeric). */
	idnumber: string;
	/** Indicates if the course is marked as a favourite. */
	isfavourite: boolean;
	/** Percentage of progress made in the course. */
	progress: number;
	/** Short name or acronym for the course. */
	shortname: string;
	/** Indicates if the short name should be displayed. */
	showshortname: boolean;
	/** Unix timestamp representing the start date of the course. */
	startdate: number;
	/** Brief description or summary of the course. */
	summary: string;
	/** Format in which the summary is written (e.g., plain text, HTML). */
	summaryformat: number;
	/** URL to view the course. */
	viewurl: string;
}

/**
 * Represents an individual attending the course.
 */
export interface Attendee {
	/** Name of the attendee. */
	name: string;
	/** URL of the attendee's profile image. */
	img: string;
	/** Role of the attendee (e.g., "Student", "Instructor"). */
	role: string;
	/** Group or cohort to which the attendee belongs. */
	group: string;
	/** Last time the attendee accessed the course/platform (in a readable format). */
	lastaccess: string;
}

/**
 * Defines the possible types of activities in a course.
 */
export type ActivityType = "assign" | "forum" | "quiz" | "url" | "choice" | "folder" | "resource";

/**
 * Represents a single activity metadata within a course.
 */
export interface ActivityMeta {
	/** Name or title of the activity. */
	name: string;
	/** URL to access the activity. */
	url: string;
	/** Additional content or details to display after the link (optional). */
	contentafterlink?: string;
}
