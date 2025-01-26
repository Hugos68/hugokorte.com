import rss from '@astrojs/rss';

export function GET(context) {
	return rss({
		title: `Hugo Korte's Blog`,
		description: `A blog documenting various struggles in the Open Source Software world.`,
		site: context.site,
		items: []
	});
}