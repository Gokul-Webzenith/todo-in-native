// tsup.api.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/api/index.ts"],
  format: ["esm"],
  target: "node20",
  platform: "node",
  outDir: "api",
  clean: true,


    external: ["@repo/db"],
});