import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ЦДУМ ПО — муфтият Пензы",
    short_name: "ЦДУМ ПО",
    description: "Время намаза, мечети Пензы и области, Соборная мечеть, новости муфтията.",
    lang: "ru",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1636",
    theme_color: "#0b1636",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Время намаза", url: "/namaz" },
      { name: "Кибла", url: "/namaz/kibla" },
    ],
  };
}
