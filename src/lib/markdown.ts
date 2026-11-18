import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkMath from 'remark-math';

export function createMarkdownProcessor() {
  return unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, [rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes?.code ?? []), ['className', /^language-[\w-]+$/]],
        span: [...(defaultSchema.attributes?.span ?? []), ['className', /^katex(?:-.*)?$/]],
      },
    }]],
  });
}
