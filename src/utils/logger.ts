import { pino } from "pino";

let p = pino();

export const logger = {
  create(scope: string) {
    return p.child({ scope });
  },
};
