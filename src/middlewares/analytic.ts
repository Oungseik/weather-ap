import { createMiddleware } from "hono/factory";
import { ObjectId } from "mongodb";

import { User, Visit } from "@/utils/mongodb.js";

import { allowPaths } from "./auth.js";

type UserFromCookie = {
	id: string;
} & Omit<User, "password">;

export const analytic_mw = createMiddleware(async (c, next) => {
	const path = c.req.path;
	if (allowPaths.includes(path)) return await next();

	const user: UserFromCookie = c.get("user");
	if (user.role !== "ADMIN") {
		Visit.insertOne({ path, userId: new ObjectId(user.id), date: new Date() });
	}

	return await next();
});
