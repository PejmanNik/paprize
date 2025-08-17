import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dts from "unplugin-dts/vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "paprize_core",
      fileName: "index",
      formats: ["esm", "umd"],
    },
  },
  plugins: [
    dts({
       insertTypesEntry: true,
       bundleTypes: true,    
    }),
    checker({
      typescript: true,
    }),
  ],
});
