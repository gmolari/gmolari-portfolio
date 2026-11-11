import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guilherme Molari · Senior Software Engineer",
    short_name: "Molari",
    description: "Portfolio of Guilherme Molari: full stack, gamification and web games.",
    start_url: "/",
    display: "standalone",
    background_color: "#10201f",
    theme_color: "#10201f",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
