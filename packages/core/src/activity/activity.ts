import type { ActivityMeta } from "../course";

export class Activity {
	constructor(
		protected fetch: typeof globalThis.fetch,
		public meta: ActivityMeta,
	) {}
}
