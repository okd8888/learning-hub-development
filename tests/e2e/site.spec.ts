import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('首頁可導覽至文章並直接開啟', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /把好奇心/ })).toBeVisible();
  await page.goto('articles/ai/mcp/introduction/');
  await expect(page.getByRole('heading', { name: 'MCP 的角色：讓工具與模型使用共同語言' })).toBeVisible();
});

test('搜尋對話框可開啟、關閉', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /搜尋/ }).click();
  await expect(page.getByRole('dialog', { name: '站內搜尋' })).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: /進階搜尋/ })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('searchbox').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: '站內搜尋' })).toBeHidden();
  await expect(page.getByRole('button', { name: /搜尋/ })).toBeFocused();
});

test('建置後的 Pagefind 索引可搜尋繁中與英文文章', async ({ page }) => {
  await page.goto('search/?q=MCP');
  await expect(page.getByRole('link', { name: /MCP 的角色/ })).toBeVisible();
});

test('文章中的數學式已渲染', async ({ page }) => {
  await page.goto('articles/ai/llm-context/');
  await expect(page.locator('.katex-html').first()).toBeVisible();
});

test('主要頁面沒有 critical 或 serious axe 問題', async ({ page }) => {
  for (const route of ['./', 'articles/ai/mcp/introduction/', 'search/']) {
    await page.goto(route);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    const serious=results.violations.filter(issue=>['critical','serious'].includes(issue.impact??''));
    const details=serious.flatMap(issue=>issue.nodes.map(node=>`${issue.id}: ${node.html}`));
    expect(serious,`${route}\n${details.join('\n')}`).toEqual([]);
  }
});

test('常用首頁寬度沒有水平溢位', async ({ page }) => {
  await page.goto('./');
  for(const width of [360,768,1024,1440]){
    await page.setViewportSize({ width, height: 900 });
    const hasOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
    expect(hasOverflow,`viewport width=${width}`).toBe(false);
  }
});
