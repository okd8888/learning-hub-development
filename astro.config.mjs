import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { createMarkdownProcessor } from './src/lib/markdown.ts';

const site = process.env.SITE_URL ?? 'https://example.github.io';
const configuredBase = process.env.SITE_BASE ?? '/learning-hub';
const base = configuredBase === '' || configuredBase === '/' ? '/' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [vue(), sitemap({ filter: (page) => !/\/(?:search|library|graph)(?:\/|$)/.test(new URL(page).pathname) })],
  markdown: { processor: createMarkdownProcessor(), shikiConfig: { theme: 'github-dark' } },
  vite: { plugins: [tailwindcss()] },
});
