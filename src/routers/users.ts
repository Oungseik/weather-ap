import { Hono } from "hono";

import { User } from "@/utils/mongodb.js";

export const router = new Hono();

router.get("/count", async (c) => {
  const count = await User.countDocuments({ role: "USER" });
  return c.json({ count });
});
