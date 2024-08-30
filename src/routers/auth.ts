import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setSignedCookie, deleteCookie } from "hono/cookie";
import { html } from "hono/html";
import { z } from "zod";

import { config } from "@/config.js";
import { logger } from "@/utils/logger.js";
import { User } from "@/utils/mongodb.js";
export const router = new Hono();

const log = logger.create("routers:auth");

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

router.post("/login", zValidator("form", LoginSchema), async (c) => {
	const { email, password } = c.req.valid("form");

	const user = await User.findOne({ email });
	if (!user || user.password !== password) {
		return c.html(
			html`<h1>Error: user does not exist or password not correct.</h1>`,
		);
	}

	const token = {
		id: user._id,
		username: user.username,
		email: user.email,
		role: user.role,
	};

	await setSignedCookie(c, "auth_token", JSON.stringify(token), config.secret, {
		path: "/",
		secure: true,
		httpOnly: true,
		maxAge: 3600,
		sameSite: "strict",
	});
	return c.redirect("/");
});

const RegisterSchema = z.object({
	username: z.string(),
	email: z.string().email(),
	password: z.string(),
});

router.post("/register", zValidator("form", RegisterSchema), async (c) => {
	const { username, email, password } = c.req.valid("form");
	const oldUser = await User.findOne({ email });
	if (oldUser) {
		log.debug(`user already exist: ${email}`);
		return c.html(html`<h1>Error: Email or Username already exist.</h1>`);
	}

	await User.insertOne({ username, email, password, role: "USER" });
	log.debug(`create new user, ${username} ${email}`);
	return c.redirect("/login");
});

router.post("/logout", async (c) => {
	deleteCookie(c, "auth_token");
	return c.redirect("/login");
});
