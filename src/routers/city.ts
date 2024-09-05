import { Hono } from "hono";
import fs from "fs";

export let router = new Hono();

router.get("/:city", async (c) => {
  let html = fs.readFileSync("pages/[city]/index.html", "utf8");
  return c.html(html);
});
