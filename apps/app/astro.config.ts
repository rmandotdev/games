import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  build: { format: "preserve" },
  integrations: [solid()],
  site: "https://games.rman.dev",
});
