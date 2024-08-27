import { env } from "process";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  target: "node22",
  splitting: false,
  sourcemap: true,
  inject: env.PRODUCTION ? [] : ["./sourcemap-support.js"],
  external: ["source-map-support"],
  clean: true,
});
