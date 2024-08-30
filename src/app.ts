import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { logger as loggerMW } from "hono/logger";

import { logger } from "@/utils/logger.js";

import { analytic_mw } from "./middlewares/analytic.js";
import { auth_mw } from "./middlewares/auth.js";
import { router as adminRouter } from "./routers/admin.js";
import { router as authRouter } from "./routers/auth.js";
import { router as userRouter } from "./routers/users.js";

export const app = new Hono();
const log = logger.create("app");

app.use(
  loggerMW((message) => {
    const msgs = message.split(" ");
    log.info(`${msgs[2]} ${msgs[3]} ${msgs[4]} ${msgs[5] || ""} ${msgs[6] || ""}`);
  }),
);

app.use(auth_mw);
app.use(analytic_mw);
app.get("/health", (c) => c.json({ message: "server is up and running" }));
app.use("/*", serveStatic({ root: "./pages" }));

app.route("/api/auth", authRouter);
app.route("/api/users", userRouter);
app.route("/api/admin", adminRouter);
