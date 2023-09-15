import type { ActivityMeta } from "../../course";
import { Activity } from "../activity";

export class UrlActivity extends Activity {
	constructor(fetch: typeof globalThis.fetch, meta: ActivityMeta) {
		super(fetch, meta);
	}

	/**
	 * Resolve the destination URL.
	 * @throws May throw an error if the URL is invalid (Moodle allows invalid URLs to be set)
	 */
	public async resolve(): Promise<URL> {
		// https://github.com/moodle/moodle/blob/master/mod/url/view.php#L33C29-L33C37
		const url = new URL(this.meta.url);
		url.searchParams.set("redirect", "1");
		const res = await this.fetch(url, { redirect: "manual" });
		const link = res.headers.get("location");
		if (!link) {
			throw new Error(
				`Failed to resolve URL, no link found in ${this.meta.url} (${this.meta.name})`,
			);
		}

		try {
			return new URL(link);
		} catch {
			throw new Error(
				`Failed to resolve URL, invalid link found in ${this.meta.url} (${this.meta.name})`,
			);
		}
	}
}
