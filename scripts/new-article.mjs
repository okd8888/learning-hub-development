import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args=process.argv.slice(2);const value=(name)=>{const index=args.indexOf(`--${name}`);return index<0?undefined:args[index+1]};
const category=value('category');const slug=value('slug');const output=value('out')??process.env.LEARNINGHUB_DRAFT_DIR;
if(!category||!slug||!output){console.error('使用方式：npm run new:article -- --category ai --slug mcp-introduction --out <私人草稿目錄>');process.exit(1);}
if(!/^[a-z0-9-]+$/.test(category)||!/^([a-z0-9-]+\/)*[a-z0-9-]+$/.test(slug)){console.error('category 與 slug 僅可使用小寫英數及連字號。');process.exit(1);}
const repository=process.cwd();const directory=path.resolve(output);const relative=path.relative(repository,directory);
if(relative===''||(!relative.startsWith(`..${path.sep}`)&&relative!=='..'&&!path.isAbsolute(relative))){console.error('草稿目錄必須位於 repository 外，避免把未核准草稿寫入公開來源。');process.exit(1);}
const config=JSON.parse(await readFile(path.join(repository,'src/config/taxonomy.json'),'utf8'));
if(!config.categories.some(item=>item.id===category)){console.error(`找不到分類「${category}」。`);process.exit(1);}
const target=path.join(directory,category,...slug.split('/'),'index.md');
const now=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei'}).format(new Date());
const content=`---\nstableId: '${category}-${slug.replaceAll('/','-')}'\nslug: '${slug}'\ntitle: '待撰寫標題'\ndescription: '待撰寫摘要。'\ncategory: '${category}'\ntype: 'note'\ntags: []\npublishedAt: '${now}'\ndraft: true\nrelated: []\n---\n\n## 學習目的\n\n## 核心概念\n\n## 實作步驟\n\n## 測試結果與問題排除\n\n## 參考資料\n`;
await mkdir(path.dirname(target),{recursive:true});
try{await writeFile(target,content,{flag:'wx'});}catch(error){if(error.code==='EEXIST'){console.error(`檔案已存在：${target}`);process.exit(1);}throw error;}
console.log(`已建立私人草稿：${target}`);
