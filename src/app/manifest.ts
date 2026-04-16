import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LumaBoard",
    short_name: "LumaBoard",
    description: "A premium personalized content dashboard for news, recommendations, and social updates.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#18181b",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/logo-mark.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ],
  };
}
