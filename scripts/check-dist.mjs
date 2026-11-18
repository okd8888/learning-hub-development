import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const dist = path.resolve('dist');
const baseValue = process.env.SITE_BASE ?? '/learning-hub';
const base = baseValue === '/' || baseValue === '' ? '/' : `/${baseValue.replace(/^\/+|\/+$/g, '')}/`;
const errors = [];
const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => { const file = path.join(directory, entry.name); return entry.isDirectory() ? walk(file) : file; }))).flat();
const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const content = await Promise.all(files.filter((file) => /\.(?:html|json|xml|js|css|txt|md)$/i.test(file)).map((file) => readFile(file, 'utf8')));
const joined = content.join('\n');
for (const marker of ['DRAFT-NEVER-PUBLISH-7F91', 'test-draft-secret-unique', 'test-future-example']) if (joined.includes(marker)) errors.push(`草稿/未來 fixture 洩漏至 dist：${marker}`);
if (process.env.REQUIRE_REAL_SITE === 'true' && /example\.github\.io|https:\/\/example\.com/.test(joined)) errors.push('正式建置仍含占位站點 origin');
if (process.env.SITE_URL && process.env.REQUIRE_REAL_SITE === 'true' && /example/i.test(process.env.SITE_URL)) errors.push('正式建置不可使用占位 SITE_URL');
for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8'); const rel = path.relative(dist, file).replaceAll(path.sep, '/');
  if (!/<title>[^<]+<\/title>/i.test(source)) errors.push(`${rel} 缺少 title`);
  if (!/rel="canonical"/i.test(source)) errors.push(`${rel} 缺少 canonical`);
  for (const match of source.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (!value.startsWith('/') || value.startsWith('//')) continue;
    if (base !== '/' && !value.startsWith(base) && !value.startsWith('/#')) errors.push(`${rel} 站內資產未套用 base path：${value}`);
    const pathname = value.split(/[?#]/, 1)[0]; if (pathname === '/' || pathname === base.slice(0,-1) || pathname === base) continue;
    const localPath = base === '/' ? pathname : pathname.startsWith(base.slice(0, -1)) ? pathname.slice(base.length - 1) || '/' : pathname;
    let target = path.join(dist, decodeURIComponent(localPath.replace(/^\//, '')));
    if (target.endsWith('/')) target = path.join(target, 'index.html');
    else if (!path.extname(target)) target = path.join(target, 'index.html');
    try { await stat(target); } catch { errors.push(`${rel} 找不到站內連結目標：${value}`); }
  }
}
if (errors.length) { console.error(`產物檢查失敗（${errors.length} 項）：\n${errors.map(error=>`- ${error}`).join('\n')}`); process.exitCode=1; }
else console.log(`產物檢查通過：${htmlFiles.length} 個 HTML；base=${base}；未發現草稿字串。`);
