import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyUrl = env.VITE_API_BASE_URL || "http://localhost:8080";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3030,
      proxy: {
        "/api": {
          target: proxyUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(proxyUrl),
    },
  };
});
