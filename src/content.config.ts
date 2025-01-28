import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({
		base: "src/content/posts",
		pattern: "*.md",
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedAt: z.date(),
		publishedAt: z.date(),
		image: z.string(),
	}),
});

const projects = defineCollection({
	loader: file("src/content/projects.json"),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		source: z.string(),
	}),
});

export const collections = { posts, projects };
