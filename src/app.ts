import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger as loggerMW } from "hono/logger";

import { logger } from "@/utils/logger";
import { auth_mw } from "./middlewares/auth";

export const app = new Hono();
const log = logger.create("app");

app.use(
	loggerMW((message) => {
		const msgs = message.split(" ");
		log.info(
			`${msgs[2]} ${msgs[3]} ${msgs[4]} ${msgs[5] || ""} ${msgs[6] || ""}`,
		);
	}),
);

app.use(auth_mw);
app.use("/*", serveStatic({ root: "./pages" }));

app.get("/health", (c) => c.json({ message: "server is up and running" }));
