import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
  ssr: {
    noExternal: ["react-helmet-async"],
  },
  server: {
    headers: {
      "Link": '</llms.txt>; rel="describedby", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/ard.json>; rel="ard"',
    },
  },
  preview: {
    headers: {
      "Link": '</llms.txt>; rel="describedby", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/ard.json>; rel="ard"',
    },
  },
});
