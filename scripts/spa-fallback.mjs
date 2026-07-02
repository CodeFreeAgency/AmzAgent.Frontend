import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const distDir = "dist";
const indexPath = join(distDir, "index.html");

if (!existsSync(indexPath)) {
  console.error("spa-fallback: dist/index.html not found. Run vite build first.");
  process.exit(1);
}

copyFileSync(indexPath, join(distDir, "404.html"));

const htaccessPath = join("public", ".htaccess");
if (existsSync(htaccessPath)) {
  copyFileSync(htaccessPath, join(distDir, ".htaccess"));
}

console.log("spa-fallback: wrote dist/404.html and dist/.htaccess");
