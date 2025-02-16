import type { APIRoute } from "astro";

const getRobotsTxt = (sitemap: URL) => `User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL("sitemap-index.xml", site);
	return new Response(getRobotsTxt(sitemapURL));
};
