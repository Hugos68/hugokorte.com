import solidJs from "@astrojs/solid-js";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { pagefind } from "vite-plugin-pagefind";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
	site: "https://hugokorte.vercel.app/",
	markdown: {
		shikiConfig: {
			themes: {
				dark: "github-dark",
				light: "github-light",
			},
		},
	},
	vite: {
		plugins: [
			tailwindcss(),
			pagefind({
				outputDirectory: "dist",
			}),
		],
	},
	integrations: [solidJs(), sitemap()],
});
