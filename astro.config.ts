import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { pagefind } from 'vite-plugin-pagefind';
import solidJs from '@astrojs/solid-js';

export default defineConfig({
  site: "https://hugokorte.com/",
  vite: {
      plugins: [
          tailwindcss(),
          pagefind({
              outputDirectory: "dist",
              developStrategy: "eager"
          }),
      ]
	},
  integrations: [solidJs()]
});