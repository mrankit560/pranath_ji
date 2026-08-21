import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sadhaulidham.com";

  const routes = [
    "",
    "/prannath-ji",
    "/philosophy",
    "/library",
    "/library/tartam-vani",
    "/media",
    "/meditation",
    "/events",
    "/articles",
    "/about",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
