import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { setSignedCookie } from "hono/cookie";
import { config } from "@/config.js";

export const router = new Hono();

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

router.post("/login", zValidator("form", LoginSchema), async (c) => {
	const { email, password } = c.req.valid("form");
	console.log(email, password);

	await setSignedCookie(c, "auth_token", "token", config.secret, {
		path: "/",
		secure: true,
		httpOnly: true,
		maxAge: 1000,
		sameSite: "strict",
	});
	return c.redirect("/");
});
