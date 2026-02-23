import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node20",

  outDir: "dist",
  clean: true,

  splitting: false,
  bundle: true,

  external: ["pg"] // only real external deps
});