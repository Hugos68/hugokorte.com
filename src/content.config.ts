import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		updatedAt: z.date(),
		publishedAt: z.date().optional(),
	})
});

const projects = defineCollection({
	type: 'data',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		preview: z.string().optional(),
		source: z.string().optional(),
	})
});

export const collections = { blog, projects };