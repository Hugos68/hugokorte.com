import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { pagefind } from "vite-plugin-pagefind";

export default defineConfig({
	site: "https://hugokorte.com/",
	vite: {
		plugins: [
			tailwindcss(),
			pagefind({
				outputDirectory: "dist",
			}),
		],
	},
	integrations: [solidJs()],
});
