import { createMiddleware } from "hono/factory";

export const auth_mw = createMiddleware(async (c, next) => {
	let token = c.req.header("Authorization");

	if (!token && !(c.req.path === "/login" || c.req.path === "/register")) {
		return c.redirect("/login");
	}

	next();
});
