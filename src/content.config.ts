import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: ({ image }) => z.object({
    stableId: z.string().regex(/^[a-z0-9][a-z0-9-]*$/), slug,
    title: z.string().min(1).max(120), description: z.string().min(1).max(240),
    category: z.string().min(1), subcategory: z.string().optional(),
    type: z.enum(['tutorial', 'note', 'review', 'project', 'resource', 'reference', 'reflection']),
    tags: z.array(z.string()).max(12).default([]), publishedAt: date, updatedAt: date.optional(),
    cover: image().optional(), coverAlt: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    featured: z.boolean().default(false), featuredOrder: z.number().int().nonnegative().optional(),
    draft: z.boolean(), related: z.array(z.string()).default([]),
    aliases: z.array(slug).default([]),
    sourceLinks: z.array(z.object({ title: z.string(), url: z.string().regex(/^https?:\/\//) })).default([]),
    license: z.string().optional(), series: z.string().optional(), seriesOrder: z.number().int().optional(),
  }),
});

const learningPaths = defineCollection({
  loader: glob({ base: './src/content/learning-paths', pattern: '**/*.md' }),
  schema: z.object({ id: z.string(), slug, title: z.string(), description: z.string(), difficulty: z.enum(['beginner', 'intermediate', 'advanced']), steps: z.array(z.object({ articleId: z.string(), title: z.string().optional() })), draft: z.boolean() }),
});

const resources = defineCollection({
  loader: glob({ base: './src/content/resources', pattern: '**/*.md' }),
  schema: z.object({ id: z.string(), title: z.string(), url: z.string().regex(/^https?:\/\//), description: z.string(), type: z.string(), tags: z.array(z.string()), checkedAt: date, draft: z.boolean(), license: z.string().optional(), notes: z.string().optional(), category: z.string().optional() }),
});

export const collections = { articles, learningPaths, resources };
