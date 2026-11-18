import { readFile,readdir } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const root=process.cwd();const paths=[];
async function walk(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())await walk(file);else if(file.endsWith('.md'))paths.push(file)}}
for(const folder of ['src/content/articles','src/content/resources'])await walk(path.join(root,folder));
const urls=new Set();for(const file of paths){const source=await readFile(file,'utf8');const matter=source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);if(matter){const data=YAML.parse(matter[1]);for(const link of data.sourceLinks??[])urls.add(link.url);if(data.url)urls.add(data.url);}for(const match of source.matchAll(/https?:\/\/[^\s)>\]]+/g))urls.add(match[0].replace(/[.,;:'"]+$/,''));}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function check(url){for(let attempt=0;attempt<3;attempt++){try{const response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'LearningHub-link-check/1.0'}});if(response.status===405||response.status===501){const fallback=await fetch(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(10000),headers:{'Range':'bytes=0-0','User-Agent':'LearningHub-link-check/1.0'}});if(fallback.ok)return null;throw new Error(`HTTP ${fallback.status}`);}if(response.ok)return null;throw new Error(`HTTP ${response.status}`);}catch(error){if(attempt===2)return `${url} — ${error.message}`;await wait(400*(attempt+1));}}}
const list=[...urls];const failures=[];for(let index=0;index<list.length;index+=5){const batch=await Promise.all(list.slice(index,index+5).map(check));failures.push(...batch.filter(Boolean));await wait(250);}
console.log(`外部連結查核：${list.length} 個網址，${failures.length} 個需要人工確認。`);for(const failure of failures)console.warn(`- ${failure}`);console.log('外部網站的節流或暫時性故障只列出報告，不阻擋內容建置。');
