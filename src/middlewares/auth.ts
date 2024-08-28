import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { html } from "hono/html";

import { config } from "@/config.js";
import { User } from "@/utils/mongodb.js";

export const allowPaths = [
	"/login",
	"/register",
	"/api/auth/login",
	"/api/auth/register",
];

export const auth_mw = createMiddleware(async (c, next) => {
	const token =
		c.req.header("Authorization")?.slice(7) ||
		(await getSignedCookie(c, config.secret, "auth_token"));

	const path = c.req.path;

	if (allowPaths.includes(path)) return await next();
	if (!token || typeof token !== "string") return c.redirect("/login");

	const user: Omit<User, "password"> = JSON.parse(token);

	if (path.startsWith("/admin") && user.role !== "ADMIN") {
		return c.html(html`<h1>Error: you are not admin to access this page</h1>`);
	}

	c.set("user", user);

	await next();
});
