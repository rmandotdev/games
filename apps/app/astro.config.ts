import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  build: { format: "preserve" },
  site: "https://games.rman.dev",
});
