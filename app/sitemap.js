export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pizzahub-client.netlify.app";
  const now = new Date();

  const routes = [
    "",
    "/menu",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
