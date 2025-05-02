import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import version from "vite-plugin-package-version";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), version()],
	server: {
		port: 5174,
	},
});
