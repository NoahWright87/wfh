import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Static output: every page is prerendered to HTML at build time.
// No backend/server is required to run this site.
export default defineConfig({
  output: "static",
  integrations: [react()],
});
