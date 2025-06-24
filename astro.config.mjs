import { defineConfig } from "astro/config";
import solid from "@astrojs/solid-js";

export default defineConfig({
  build: { format: "preserve" },
  output: "static",
  viewTransitions: true,
  integrations: [solid()],
});
