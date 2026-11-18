import { describe, expect, it } from 'vitest';
import type { AstroMarkdownOptions } from '@astrojs/markdown-remark';
import { createMarkdownProcessor } from '../../src/lib/markdown';

describe('Markdown 安全與公式渲染', () => {
  it('移除危險 HTML 與網址，並保留安全公式排版', async () => {
    const renderer=await createMarkdownProcessor().createRenderer({} as AstroMarkdownOptions);
    const output=(await renderer.render('<img src="x" onerror="alert(1)">\n\n[不安全連結](javascript:alert(1))\n\n$E=mc^2$')).code;
    expect(output).not.toMatch(/onerror|javascript:/i);
    expect(output).toContain('class="katex"');
  });
});
