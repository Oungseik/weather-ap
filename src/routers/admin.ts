import { Visit } from "@/utils/mongodb.js";
import { Hono } from "hono";

export let router = new Hono();

let countVisitors = async (start: Date) => {
	let result = await Visit.aggregate([
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
	let daily = new Date();
	daily.setHours(0, 0, 0, 0);

	let dailyCount = await countVisitors(daily);
	let weeklyCount;
	let monthlyCount;

	let weekly = new Date();
	weekly.setDate(daily.getDate() - 7);
	if (c.req.query("weekly")) {
		weeklyCount = await countVisitors(weekly);
	}

	let monthly = new Date();
	monthly.setDate(daily.getDate() - 30);
	if (c.req.query("monthly")) {
		monthlyCount = await countVisitors(monthly);
	}

	return c.json({ dailyCount, weeklyCount, monthlyCount });
});
