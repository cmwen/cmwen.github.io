import { SITE } from "@config";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z, type ZodType } from "astro/zod";

// ---------------------------------------------------------------------------
// Recursive MindMapNode schema (used by the mindmaps data collection)
// ---------------------------------------------------------------------------
type MindMapRefInput = {
  targetId: string;
  label?: string;
};

type MindMapNodeInput = {
  id: string;
  label: string;
  color?: string;
  notes?: string;
  annotation?: string;
  refs?: MindMapRefInput[];
  children?: MindMapNodeInput[];
};

const mindMapRefSchema = z.object({
  targetId: z.string(),
  label: z.string().optional(),
});

const mindMapNodeSchema: ZodType<MindMapNodeInput> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string(),
    color: z.string().optional(),
    notes: z.string().optional(),
    annotation: z.string().optional(),
    refs: z.array(mindMapRefSchema).optional(),
    children: z.array(mindMapNodeSchema).optional(),
  })
);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      lang: z.enum(["en", "zh-hant"]).default("en"),
      translatedFrom: z.string().optional(),
      baseSlug: z.string().optional(),
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      llmKeyIdeas: z.array(z.string()).optional(),
    }),
});

const notebooks = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/notebooks" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDatetime: z.date(),
    modDatetime: z.date().optional().nullable(),
    tags: z.array(z.string()).default(["notes"]),
    draft: z.boolean().optional(),
  }),
});

const mindmaps = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/mindmaps" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    createdAt: z.string(),
    updatedAt: z.string(),
    root: mindMapNodeSchema,
  }),
});

export const collections = { blog, notebooks, mindmaps };
