import { export_data } from "$lib/server/export";
import type { RequestHandler } from "./$types";
export const GET = (async ({ url }) => {
	const base = url.searchParams.get("base") ?? "";
	const username = url.searchParams.get("username") ?? undefined;
	const password = url.searchParams.get("password") ?? undefined;
	const session = url.searchParams.get("session") ?? undefined;
	const filter = url.searchParams.get("filter") ?? undefined;

	return export_data({ base, username, password, session, filter });
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
	if (!request.body) {
		return new Response("Missing body", { status: 400 });
	}

	const { base, username, password, session, filter } = await request.json();

	return export_data({ base, username, password, session, filter });
}) satisfies RequestHandler;
