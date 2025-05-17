import { MetadataRoute } from "next";
import { directory } from "@/directory.config";

// This is a simplified sitemap that doesn't rely on database connections
// to avoid build errors during deployment
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = directory.baseUrl;

  // Static pages only
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }
  ];
}
