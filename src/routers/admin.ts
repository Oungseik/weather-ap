import { Hono } from "hono";

import { Visit } from "@/utils/mongodb.js";

export const router = new Hono();

const countVisitors = async (start: Date) => {
  const result = await Visit.aggregate([
    {
      $match: {
        date: { $gte: start },
      },
    },
    {
      $group: {
        _id: "$userId",
      },
    },
    {
      $count: "uniqueUserCount",
    },
  ]).toArray();

  return result.length > 0 ? result[0]?.uniqueUserCount : 0;
};

router.get("/vistors/count", async (c) => {
  const daily = new Date();
  daily.setHours(0, 0, 0, 0);

  const dailyCount = await countVisitors(daily);
  let weeklyCount;
  let monthlyCount;
  let yearlyCount;

  const weekly = new Date();
  weekly.setDate(daily.getDate() - 7);
  if (c.req.query("weekly")) {
    weeklyCount = await countVisitors(weekly);
  }

  const monthly = new Date();
  monthly.setDate(daily.getDate() - 30);
  if (c.req.query("monthly")) {
    monthlyCount = await countVisitors(monthly);
  }

  const yearly = new Date();
  yearly.setDate(daily.getDate() - 365);
  if (c.req.query("yearly")) {
    yearlyCount = await countVisitors(yearly);
  }

  return c.json({ dailyCount, weeklyCount, monthlyCount, yearlyCount });
});
