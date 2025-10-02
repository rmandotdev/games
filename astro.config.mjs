import { defineConfig } from "astro/config";

import solid from "@astrojs/solid-js";

export default defineConfig({
  output: "static",
  build: { format: "preserve" },
  integrations: [solid()],
  site: "https://games.rman.dev",
});
