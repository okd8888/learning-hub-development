import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const root = process.cwd();
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());
const taxonomy = JSON.parse(await readFile(path.join(root, 'src/config/taxonomy.json'), 'utf8'));
const articleDir = path.join(root, 'src/content/articles');
const failures = [];
const articles = [];
const unique = new Map();
const aliasSlugs = new Map();
const errors = (file, message) => failures.push(`${path.relative(root, file)}: ${message}`);
function checkUniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item?.id || seen.has(item.id)) failures.push(`src/config/taxonomy.json: ${label} ID 缺漏或重複「${item?.id ?? ''}」`);
    seen.add(item?.id);
  }
}
checkUniqueIds(taxonomy.categories, 'category');
checkUniqueIds(taxonomy.tags, 'tag');
if (new Set(taxonomy.types).size !== taxonomy.types.length) failures.push('src/config/taxonomy.json: type ID 重複');
for (const category of taxonomy.categories) checkUniqueIds(category.children ?? [], `subcategory in ${category.id}`);
const filesUnder = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return (await Promise.all(entries.map(async (entry) => entry.isDirectory() ? filesUnder(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
};
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
function parseMarkdown(file, source) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) { errors(file, '缺少 YAML frontmatter'); return null; }
  try { return { data: YAML.parse(match[1]), body: source.slice(match[0].length) }; }
  catch (error) { errors(file, `YAML 格式錯誤：${error.message}`); return null; }
}
function checkSlug(slug) { return typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug); }

for (const file of await filesUnder(articleDir)) {
  if (!file.endsWith('.md')) continue;
  const source = await readFile(file, 'utf8'); const parsed = parseMarkdown(file, source); if (!parsed) continue;
  const data = parsed.data; articles.push({ file, data, body: parsed.body });
  if (!/^[a-z0-9][a-z0-9-]*$/.test(data.stableId ?? '')) errors(file, 'stableId 必須使用小寫英數與連字號');
  if (!checkSlug(data.slug)) errors(file, 'slug 格式不正確');
  for (const [field, max] of [['title', 120], ['description', 240]]) if (typeof data[field] !== 'string' || !data[field].trim() || data[field].length > max) errors(file, `${field} 必填且長度不得超過 ${max}`);
  const category = taxonomy.categories.find((item) => item.id === data.category);
  if (!category) errors(file, `category「${data.category}」不存在`);
  if (data.subcategory && !category?.children.some((item) => item.id === data.subcategory)) errors(file, `subcategory「${data.subcategory}」不屬於主分類`);
  if (!taxonomy.types.includes(data.type)) errors(file, `type「${data.type}」不在允許清單`);
  if (!Array.isArray(data.tags) || data.tags.length > 12 || new Set(data.tags).size !== data.tags.length || data.tags.some((tag) => !taxonomy.tags.some((item) => item.id === tag))) errors(file, 'tags 必須是 0–12 個唯一且已登錄的標籤 ID');
  if (typeof data.draft !== 'boolean') errors(file, 'draft 必須明確設為 true 或 false');
  if (!validDate(data.publishedAt)) errors(file, 'publishedAt 必須是有效 YYYY-MM-DD 日期');
  if (data.updatedAt && (!validDate(data.updatedAt) || data.updatedAt < data.publishedAt)) errors(file, 'updatedAt 必須是有效日期且不早於 publishedAt');
  if (data.publishedAt > today && !data.draft) errors(file, '未來日期文章必須留在測試 fixture，不可公開');
  if (data.updatedAt > today && !data.draft) errors(file, '未來 updatedAt 文章不可公開');
  if (data.cover && !data.coverAlt && data.coverAlt !== '') errors(file, '自訂封面必須提供 coverAlt');
  if (!unique.has(data.stableId)) unique.set(data.stableId, file); else errors(file, `stableId 重複（${path.relative(root, unique.get(data.stableId))}）`);
  for (const slug of [data.slug, ...(data.aliases ?? [])]) {
    if (!checkSlug(slug)) errors(file, `slug 或 alias「${slug}」格式不正確`);
    if (aliasSlugs.has(slug)) errors(file, `slug/alias「${slug}」與 ${path.relative(root, aliasSlugs.get(slug))} 衝突`); else aliasSlugs.set(slug, file);
  }
  for (const sourceLink of Array.isArray(data.sourceLinks) ? data.sourceLinks : []) {
    try { if (!['http:', 'https:'].includes(new URL(sourceLink.url).protocol)) errors(file, `sourceLinks 只允許 http/https：${sourceLink.url}`); }
    catch { errors(file, `sourceLinks 網址格式不正確：${sourceLink.url}`); }
  }
  if (Array.isArray(data.related) && data.related.includes(data.stableId)) errors(file, 'related 不可指向自己');
}
for (const { file, data } of articles) for (const related of Array.isArray(data.related) ? data.related : []) if (!unique.has(related)) errors(file, `related 文章 stableId「${related}」不存在`);

for (const group of ['learning-paths', 'resources']) {
  const directory = path.join(root, 'src/content', group);
  for (const file of await filesUnder(directory)) {
    if (!file.endsWith('.md')) continue;
    const parsed = parseMarkdown(file, await readFile(file, 'utf8')); if (!parsed) continue;
    const { data } = parsed;
    if (!data.id || !data.title || !data.description) errors(file, 'id、title、description 為必填欄位');
    if (typeof data.draft !== 'boolean') errors(file, 'draft 必須明確設定');
    if (group === 'learning-paths') {
      if (!checkSlug(data.slug)) errors(file, 'slug 格式不正確');
      const refs = (data.steps ?? []).map((step) => step.articleId);
      if (new Set(refs).size !== refs.length) errors(file, 'steps 不可重複參照同一文章');
      for (const ref of refs) { const target = articles.find((article) => article.data.stableId === ref); if (!target || target.data.draft || target.data.publishedAt > today) errors(file, `step articleId「${ref}」不存在或尚未發布`); }
    } else {
      if (!validDate(data.checkedAt)) errors(file, 'checkedAt 必須是有效日期');
      try { if (!['http:', 'https:'].includes(new URL(data.url).protocol)) errors(file, '資源網址僅允許 http/https'); } catch { errors(file, '資源 url 格式不正確'); }
    }
  }
}

if (failures.length) { console.error(`內容驗證失敗（${failures.length} 項）：\n${failures.map((error) => `- ${error}`).join('\n')}`); process.exitCode = 1; }
else console.log(`內容驗證通過：${articles.length} 篇文章；taxonomy、路徑與資源參照有效。`);
