import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/help": "http://localhost:3000",
      "/about": "http://localhost:3000",
      "/contact": "http://localhost:3000",
      "/signup": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/logout": "http://localhost:3000",
      "/account_activations": "http://localhost:3000",
      "/password_resets": "http://localhost:3000",
    },
  },
});
