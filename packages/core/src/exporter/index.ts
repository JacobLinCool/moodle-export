import { from_session, login } from "../auth";
import { fetch_course_list } from "../course";

/**
 * Represents the initialization options for the Moodle exporter.
 */
export type MoodleExporterInitialize =
	| {
			/** The base URL for the Moodle instance. */
			base: string;
			/** The username for the Moodle instance. */
			username: string;
			/** The password for the Moodle instance. */
			password: string;
	  }
	| {
			/** The base URL for the Moodle instance. */
			base: string;
			/** The MoodleSession cookie value. */
			session: string;
	  };

/**
 * The `MoodleExporter` class provides methods for exporting data from a Moodle site.
 * Use the `init` static method to create a new instance of the class.
 */
export class MoodleExporter {
	/**
	 * Do not use this constructor directly. Use the `init` static method instead.
	 */
	constructor(
		protected base: string,
		protected fetch: typeof globalThis.fetch,
	) {}

	/**
	 * Internal cache for the course list.
	 * Can be purged with the `purge` method.
	 */
	protected _fetch_course_list_cached?: ReturnType<typeof fetch_course_list>;

	/**
	 * Fetches a list of courses from the Moodle site.
	 * @returns An array of Course objects.
	 */
	public async courses() {
		if (!this._fetch_course_list_cached) {
			this._fetch_course_list_cached = fetch_course_list(this.fetch, this.base);
		}

		return this._fetch_course_list_cached;
	}

	/**
	 * Purge the internal caches.
	 */
	public purge() {
		this._fetch_course_list_cached = undefined;
	}

	/**
	 * Initializes a new instance of the MoodleExporter class.
	 * @param init - An object containing the initialization parameters.
	 * @returns A new instance of the MoodleExporter class.
	 */
	public static async init(init: MoodleExporterInitialize): Promise<MoodleExporter> {
		const fetch =
			"session" in init
				? from_session(init.base, init.session)
				: login(init.base, init.username, init.password);
		return new MoodleExporter(init.base, await fetch);
	}
}
