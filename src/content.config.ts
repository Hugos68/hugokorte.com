import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	loader: glob({
		base: "./src/content/posts",
		pattern: "*.md"
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedAt: z.date(),
		publishedAt: z.date().optional(),
	})
});

const projects = defineCollection({
	loader: glob({
		base: "./src/content/projects",
		pattern: "*.json"
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		preview: z.string().optional(),
		source: z.string().optional(),
	})
});

export const collections = { posts, projects };