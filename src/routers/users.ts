import { Hono } from "hono";

import { User } from "@/utils/mongodb.js";

export const router = new Hono();

router.get("/count", async (c) => {
  const count = await User.countDocuments({ role: "USER" });
  return c.json({ count });
});

router.get("/", async (c) => {
  let users = await User.find({}, { projection: { password: 0 } }).toArray();

  return c.json(users);
});
