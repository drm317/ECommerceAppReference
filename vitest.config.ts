import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["graphql"],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    clearMocks: true,
    setupFiles: ["src/test/setup-ui.ts"],
    deps: {
      optimizer: {
        ssr: {
          include: ["graphql", "@graphql-tools/schema", "@graphql-tools/utils"],
        },
      },
    },
  },
});
