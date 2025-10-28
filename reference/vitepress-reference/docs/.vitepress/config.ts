import { defineConfig } from "vitepress";

export default defineConfig({
  // --- Global Site Metadata ---
  title: "Documentation Reference",
  description: "A minimal, generic VitePress documentation reference.",
  lang: "en-US",
  base: "/", // Important for deployment on Cloudflare Pages

  // --- Theme Configuration ---
  themeConfig: {
    // logo: "/logo.svg", // Logo can be added by the template

    // Top navigation menu (kept minimal for the reference)
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "About", link: "/about" },
    ],

    // Sidebar structure (minimal tree structure)
    sidebar: {
      // The default sidebar for the root (/) path
      "/": [
        { text: "Introduction", link: "/" },
        {
          text: "Getting Started",
          items: [
            { text: "Installation", link: "/guide/installation" },
            { text: "Configuration", link: "/guide/configuration" },
          ],
        },
        { text: "About this Template", link: "/about" },
      ],
    },

    // Footer configuration
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 VibeSDK",
    },

    // Social links (removed custom links, using VibeSDK placeholders)
    socialLinks: [{ icon: "github", link: "https://github.com/vibe-sdk" }],
  },

  // Clean URL generation
  cleanUrls: true,
  // --- Vite Dev Server Settings ---
  vite: {
    server: {
      host: "0.0.0.0",
      port: process.env.PORT ? Number(process.env.PORT) : 5173,
      allowedHosts: true,
    },
  },
});
