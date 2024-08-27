import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { z } from "zod";
import { html } from "hono/html";

import { config } from "@/config.js";
import { User } from "@/utils/mongodb.js";

import { logger } from "@/utils/logger.js";
export const router = new Hono();

let log = logger.create("routers:auth");

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

router.post("/login", zValidator("form", LoginSchema), async (c) => {
	const { email, password } = c.req.valid("form");

	await setSignedCookie(c, "auth_token", "token", config.secret, {
		path: "/",
		secure: true,
		httpOnly: true,
		maxAge: 1000,
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
	let { username, email, password } = c.req.valid("form");
	let oldUser = await User.findOne({ email });
	if (oldUser) {
		log.debug(`user already exist: ${email}`);
		return c.html(html`<h1>Error: Email or Username already exist.</h1>`);
	}

	await User.insertOne({ username, email, password, role: "USER" });
	log.debug(`create new user, ${username} ${email}`);
	c.redirect("/login");
});
