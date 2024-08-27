import process from "node:process";

import { pino } from "pino";

const p = pino();

p.level = process.env.PINO_LOG_LEVEL || "info";

export const logger = {
	create(scope: string) {
		return p.child({ scope });
	},
};
