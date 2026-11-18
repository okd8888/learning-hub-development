import { readFile,readdir } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const root=process.cwd();const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei'}).format(new Date());const failures=[];
async function files(directory){const entries=await readdir(directory,{withFileTypes:true}).catch(()=>[]);return(await Promise.all(entries.map(async(entry)=>entry.isDirectory()?files(path.join(directory,entry.name)):path.join(directory,entry.name)))).flat();}
for(const folder of ['src/content/articles','src/content/learning-paths','src/content/resources'])for(const file of await files(path.join(root,folder))){if(!file.endsWith('.md'))continue;const source=await readFile(file,'utf8');const match=source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);if(!match){failures.push(`${path.relative(root,file)} 缺少 frontmatter`);continue;}const data=YAML.parse(match[1]);if(data.draft!==false)failures.push(`${path.relative(root,file)} 含未核准草稿，公開 repository 只可放 draft: false`);if(data.publishedAt&&data.publishedAt>today)failures.push(`${path.relative(root,file)} 發布日期在未來`);if(data.updatedAt&&data.updatedAt>today)failures.push(`${path.relative(root,file)} 更新日期在未來`);}
if(failures.length){console.error(`公開內容審核門檻失敗：\n${failures.map(item=>`- ${item}`).join('\n')}`);process.exitCode=1;}else console.log('公開內容門檻通過：來源文章、路徑與資源均非草稿且日期有效。');
