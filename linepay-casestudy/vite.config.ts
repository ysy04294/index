import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" 로 두면 Vercel 루트와 GitHub Pages 하위 경로 어디에 올려도 동작한다.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
