import solid from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [solid()],
  vite: { plugins: [tailwindcss()], build: { cssTarget: "safari15" } },
  fonts: [
    {
      name: "Poppins",
      cssVariable: "--font-poppins",
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ["normal"],
    },
  ],
  site: "https://nim.rman.dev",
});
