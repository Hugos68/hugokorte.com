import type { APIRoute } from "astro";

const getRobotsTxt = (sitemap: URL) => [
    "User-agent: *",
    "Allow: /",
    "\n",
    `Sitemap: ${sitemap}`,
].join("\n");

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL("sitemap-index.xml", site);
	return new Response(getRobotsTxt(sitemapURL));
};
