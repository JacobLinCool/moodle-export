import cookie from "fetch-cookie";
import { parse } from "node-html-parser";
import { ext } from "../debug";

const log = ext("auth");

/**
 * Logs in to the Moodle site using the provided credentials and returns a fetch instance with authenticated cookies.
 * @param base - The base URL of the Moodle site.
 * @param username - The username of the user to log in.
 * @param password - The password of the user to log in.
 * @returns A fetch instance with authenticated cookies.
 * @throws An error if the login fails.
 */
export async function login(
	base: string,
	username: string,
	password: string,
): Promise<typeof globalThis.fetch> {
	const jar = new cookie.toughCookie.CookieJar();
	const f = cookie(fetch, jar);

	const logintoken = await get_logintoken(f, base);

	const url = new URL(base);
	url.pathname = "/login/index.php";
	log("Logging in", url, logintoken, username, password);

	const res = await f(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			logintoken,
			username,
			password,
		}).toString(),
	});

	if (new URL(res.url).pathname.includes("login")) {
		throw new Error("Login failed");
	}

	log("Logged in");
	return f;
}

/**
 * Creates a fetch instance with a cookie jar containing the MoodleSession cookie.
 * @param base - The base URL for the Moodle instance.
 * @param session - The MoodleSession cookie value.
 * @returns A fetch instance with the MoodleSession cookie set in its cookie jar.
 */
export async function from_session(
	base: string,
	session: string,
): Promise<typeof globalThis.fetch> {
	const jar = new cookie.toughCookie.CookieJar();
	jar.setCookieSync(`MoodleSession=${session}`, base);

	return cookie(fetch, jar);
}

/**
 * Fetches the login token from the given URL using the provided (unauthorized) fetch function.
 * @param fetch - The fetch function to use for making the request.
 * @param base - The base URL to fetch the login token from.
 * @returns The login token string.
 * @throws An error if the login token cannot be found.
 */
export async function get_logintoken(
	fetch: typeof globalThis.fetch,
	base: string,
): Promise<string> {
	log("Fetching login token", base);
	const url = new URL(base);

	const res = await fetch(url);
	const html = await res.text();

	const root = parse(html);
	const logintoken = root.querySelector("input[name=logintoken]")?.getAttribute("value");
	if (!logintoken) {
		throw new Error("Could not get logintoken");
	}

	log("Got login token", logintoken);
	return logintoken;
}
