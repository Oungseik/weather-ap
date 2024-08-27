import { serve } from "@hono/node-server";

import { app } from "./app.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";
import { setupMongodb } from "./utils/mongodb.js";

const log = logger.create("index");

serve({ fetch: app.fetch, port: config.port }, () => {
	setupMongodb().then(() => log.info("successfully connected to MongoDB."));
});
