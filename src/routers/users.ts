import { Hono } from "hono";

import { User } from "@/utils/mongodb.js";

type Variables = {
  user: Omit<User, "password">;
};

export const router = new Hono<{ Variables: Variables }>();

router.get("/count", async (c) => {
  const count = await User.countDocuments({ role: "USER" });
  return c.json({ count });
});

router.get("/", async (c) => {
  const users = await User.find({}, { projection: { password: 0 } }).toArray();

  return c.json(users);
});

router.get("/one", async (c) => {
  const { username } = c.get("user");
  const user = await User.findOne({ username: username }, { projection: { password: 0 } });
  return c.json(user);
});

router.post("/", async (c) => {
  const user = c.get("user");

  const { transportation, note } = await c.req.json();
  await User.updateOne(
    { username: user.username },
    {
      $set: {
        transportation,
        note,
      },
    }
  );
  return c.json({ username: user.username });
});
