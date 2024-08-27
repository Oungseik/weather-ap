import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { config } from "@/config.js";

let allowPaths = [
	"/login",
	"/register",
	"/api/auth/login",
	"api/auth/register",
];

export const auth_mw = createMiddleware(async (c, next) => {
	const token =
		c.req.header("Authorization") ||
		(await getSignedCookie(c, config.secret, "auth_token"));

	if (!token && !allowPaths.includes(c.req.path)) {
		return c.redirect("/login");
	}

	await next();
});
