import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';

export const GET: APIRoute = (context) =>{
	return rss({
		title: `Hugo Korte's Blog`,
		description: `A blog documenting various struggles in the Open Source Software world.`,
		site: context.site!,
		items: []
	});
}