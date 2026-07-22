import solid from "@astrojs/solid-js";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
  vite: { build: { cssTarget: "safari15" } },
  site: "https://simon-says.rman.dev",
});
