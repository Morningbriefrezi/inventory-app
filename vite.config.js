import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Change 'inventory-app' to your actual GitHub repository name
// Example: if your repo URL is github.com/username/my-inventory → base: "/my-inventory/"
export default defineConfig({
  plugins: [react()],
  base: "/inventory-app/",
});
