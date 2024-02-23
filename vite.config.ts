import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@ylbupt/p5-project": resolve(__dirname, "src/index"), // 路径别名
    },
  },
  build: {
    outDir: "./html",
  },
});
