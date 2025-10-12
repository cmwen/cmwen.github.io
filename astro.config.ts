import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      ENABLE_SERVER_ISLANDS: envField.boolean({
        context: "server",
        access: "secret",
        default: false,
      }),
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  vite: {
    resolve: {
      // Ensure a single React instance between renderer and components
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      // Pre-bundle a single copy of react/react-dom; exclude heavy wasm dep
      include: ["react", "react-dom"],
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
    },
    responsiveStyles: true,
  },
  scopedStyleStrategy: "where",
});
