// rollup --config
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "dist/index.js",
  output: [
    {
      file: "./build/p5-project.esm.js",
      format: "esm",
    },
    {
      file: "./build/p5-project.cjs.js",
      format: "cjs",
    },
    {
      file: "./build/p5-project.umd.js",
      format: "umd",
      name: "p5-project",
      globals: {
        p5: "p5",
      },
    },
  ],
  external: ["p5"],
  plugins: [resolve({ extensions: [".js"] })],
};
