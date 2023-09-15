import type { ActivityMeta } from "../../course";
import { Activity } from "../activity";

export class ResourceActivity extends Activity {
	constructor(fetch: typeof globalThis.fetch, meta: ActivityMeta) {
		super(fetch, meta);
	}

	protected _destination?: Promise<URL>;

	/**
	 * Gets the destination URL for the resource.
	 * @returns The destination URL for the resource.
	 */
	public async destination(): Promise<URL> {
		if (!this._destination) {
			// https://github.com/moodle/moodle/blob/master/mod/resource/view.php#L33
			const url = new URL(this.meta.url);
			url.searchParams.set("redirect", "1");
			this._destination = this.fetch(url, {
				redirect: "manual",
			})
				.then((res) => {
					return new URL(res.headers.get("location") ?? "");
				})
				.catch((err) => {
					console.log(`Failed to fetch resource ${this.meta.url} with error ${err}`);
					return new URL(this.meta.url);
				});
		}

		return this._destination;
	}

	/**
	 * Download the resource.
	 * @returns The resource's content.
	 */
	public async download(): Promise<ArrayBuffer> {
		const url = await this.destination();
		const res = await this.fetch(url);
		return res.arrayBuffer();
	}

	/**
	 * Get the filename of the resource.
	 * @returns The filename of the resource.
	 */
	public async filename(): Promise<string> {
		const url = await this.destination();
		return decodeURIComponent(url.pathname.split("/").pop() ?? "");
	}
}
