export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pizzahub-client.netlify.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/admin", "/dashboard/vendor", "/dashboard/customer"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
