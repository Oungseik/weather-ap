import { pino } from "pino";

const p = pino();

export const logger = {
  create(scope: string) {
    return p.child({ scope });
  },
};
