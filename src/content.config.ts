import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const posts = defineCollection({
	loader: glob({
		base: "src/content/posts",
		pattern: "*.md",
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			updatedAt: z.date(),
			publishedAt: z.date(),
			image: image(),
			visibility: z.enum(["public", "hidden", "private"]),
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
