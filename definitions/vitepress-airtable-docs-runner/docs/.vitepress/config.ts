// .vitepress/config.ts
import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
  defineConfig({
    title: "Airtable Base Docs", // ⬅️️ update and include base name
    description: "Data dictionary & developer guide for an Airtable base",
    lang: "en-US",

    // Mermaid stays enabled for schema/flow diagrams
    mermaid: {},

    themeConfig: {
      // Minimal, generic sidebar scaffold; replace/extend per base
      sidebar: {
        "/": [
          { text: "Overview", link: "/" },

          {
            text: "Tables",
            // Tip: have your generator replace this block with per-table pages
            items: [
              { text: "README", link: "/tables/README" },
              // { text: "Clients", link: "/tables/clients" },
              // { text: "Invoices", link: "/tables/invoices" },
            ],
          },

          {
            text: "Interfaces",
            items: [
              // Each documented interface should have its own page
              { text: "README", link: "/interfaces/README" },
              // { text: "Operations", link: "/interfaces/operations" },
            ],
          },

          {
            text: "Automations",
            items: [
              // Each documented automation should have its own page
              // { text: "Create Invoice Button", link: "/automations/create-invoice-button" },
            ],
          },

          {
            text: "Changelog",
            items: [
              // If there is lots of schema changes already, create a page for each month and group them by month
              // { text: "Schema Changes", link: "/changelog/schema" },
              // { text: "Release Notes", link: "/changelog/releases" },
            ],
          },
        ],
      },

      // Leave empty in the starter; template can inject brand links later
      socialLinks: [
        // { icon: "github", link: "https://github.com/your-org/your-repo" },
      ],
    },
  }),
);
