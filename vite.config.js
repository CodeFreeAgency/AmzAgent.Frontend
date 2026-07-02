import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";

// Served at https://demo.sellingpartnerservices.com/ (site root). Override via BASE_URL if needed.
const BASE_URL = process.env.BASE_URL || "/";


function spaFallback() {
  return {
    name: "spa-fallback",
    closeBundle() {
      const distDir = join(process.cwd(), "dist");
      const indexPath = join(distDir, "index.html");
      if (!existsSync(indexPath)) return;
      copyFileSync(indexPath, join(distDir, "404.html"));
    },
  };
}

function rewritePublicPaths() {
  return {
    name: "rewrite-public-paths",
    transform(code, id) {
      if (id.includes("node_modules")) return null;
      if (!/\.(jsx?|tsx?)$/.test(id)) return null;
      const rewritten = code.replace(
        /(=\s*|:\s*)["'](\/img\/)([^"']*)["']/g,
        (_, prefix, _slashImg, rest) =>
          `${prefix}(import.meta.env.BASE_URL + 'img/${rest.replace(/'/g, "\\'")}')`
      );
      return rewritten !== code ? { code: rewritten } : null;
    },
  };
}

export default defineConfig({
  base: BASE_URL,
  plugins: [react(), rewritePublicPaths(), spaFallback()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          charts: ["apexcharts", "react-apexcharts"],
          ui: ["@material-tailwind/react", "@heroicons/react"],
        },
      },
    },
  },
});
