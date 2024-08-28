import { serve } from "@hono/node-server";

import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";
import { setupMongodb, User } from "./utils/mongodb.js";

const log = logger.create("index");

serve({ fetch: app.fetch, port: config.port }, () => {
	setupMongodb()
		.then(() => log.info("successfully connected to MongoDB."))
		.then(createAdminIfNotExist);
});

async function createAdminIfNotExist() {
	const admin = await User.findOne({ username: "admin" });
	if (admin) {
		log.debug("admin account already exist.");
		return;
	}
	await User.insertOne({
		username: "admin",
		email: "admin@gmail.com",
		password: "12345678",
		role: "ADMIN",
	});
	log.debug("created a new admin account.");
}
