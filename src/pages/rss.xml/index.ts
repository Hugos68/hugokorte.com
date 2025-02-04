import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
	if (!context.site) {
		throw new Error(
			"Unable to generate RSS feed due to missing `context.site`",
		);
	}
	const posts = await getCollection(
		"posts",
		(post) => post.data.visibility === "hidden",
	);
	return rss({
		title: "Hugo Korte's Blog",
		description: "Hugo Korte's Blog",
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.publishedAt,
			description: post.data.description,
			link: `/blog/${post.id}/`,
		})),
	});
}
