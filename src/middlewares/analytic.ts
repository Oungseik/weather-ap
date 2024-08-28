import { User, Visit } from "@/utils/mongodb.js";
import { createMiddleware } from "hono/factory";

import { allowPaths } from "./auth.js";
import { ObjectId } from "mongodb";

type UserFromCookie = {
	id: string;
} & Omit<User, "password">;

export let analytic_mw = createMiddleware(async (c, next) => {
	let path = c.req.path;
	if (allowPaths.includes(path)) return await next();

	let user: UserFromCookie = c.get("user");
	if (user.role !== "ADMIN") {
		Visit.insertOne({ path, userId: new ObjectId(user.id), date: new Date() });
	}

	return await next();
});
