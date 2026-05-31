import { siteConfig } from "@/lib/seo";

export const runtime = "edge";

export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${siteConfig.url}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
