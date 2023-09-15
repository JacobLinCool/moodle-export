// The debug package will be failing to load.

let _debugging = false;
export function debug(name: string) {
	let last = Date.now();
	const x = (...args: unknown[]) => {
		if (!_debugging) {
			return;
		}
		const now = Date.now();
		console.log(`[${name}]`, `+${now - last}ms`, ...args);
		last = now;
	};
	x.extend = (name: string) => debug(`${name}:${name}`);
	return x;
}

export function debugging() {
	_debugging = true;
}

export const log = debug("moodle-export");

export const ext = (name: string) => log.extend(name);
