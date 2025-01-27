import { defineCollection, z } from 'astro:content';

const blog = defineCollection({

});

const projects = defineCollection({
	type: 'data',
	schema: z.object({
		title: z.string(),
		content: z.string(),
		preview: z.string().optional(),
		source: z.string().optional(),
	})
});

export const collections = { blog, projects };