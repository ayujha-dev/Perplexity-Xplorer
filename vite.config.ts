import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const VIRTUAL_PREFIX = "\0threeui-missing-source:";

/**
 * Resolves unbundled sibling `./sources/*.html?raw` imports referenced inside
 * ThreeUI's Neuform collection registries when only the active variant's
 * registered source files are present on disk, leaving every authored file
 * untouched and SHA-256 identical.
 */
function threeuiSiblingFallbackPlugin(): Plugin {
  return {
    name: "threeui-sibling-source-fallback",
    enforce: "pre",
    resolveId(source, importer) {
      if (!importer || !source.endsWith(".html?raw")) return null;
      if (!importer.includes("neuform-isolated")) return null;
      const cleanPath = source.slice(0, -4); // strip ?raw
      const resolved = path.resolve(path.dirname(importer), cleanPath);
      if (existsSync(resolved)) return null;
      return `${VIRTUAL_PREFIX}${resolved}.mjs`;
    },
    load(id) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return { code: "export default '';", map: null };
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [threeuiSiblingFallbackPlugin(), react()],
  build: {
    target: "esnext",
  },
});
