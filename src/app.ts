import { Hono } from "hono";
import { logger as loggerMW } from "hono/logger";
import { logger } from "@/utils/logger";

export let app = new Hono();
let log = logger.create("app");

app.use(
	loggerMW((message) => {
		let msgs = message.split(" ");
		log.info(
			`${msgs[2]} ${msgs[3]} ${msgs[4]} ${msgs[5] || ""} ${msgs[6] || ""}`,
		);
	}),
);

app.get("/health", (c) => c.json({ message: "server is up and running" }));
