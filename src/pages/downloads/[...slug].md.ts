import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../../lib/content';
export async function getStaticPaths(){return (await getPublishedArticles()).map(article=>({params:{slug:article.data.slug},props:{article}}))}
export const GET: APIRoute=({props})=>{
 const {article}=props as any;const {data}=article;
 const metadata=Object.entries(data).map(([key,value])=>`${key}: ${JSON.stringify(value)}`).join('\n');
 return new Response(`---\n${metadata}\n---\n\n${article.body??''}`,{headers:{'Content-Type':'text/markdown; charset=utf-8','Content-Disposition':`attachment; filename="${data.slug.split('/').at(-1)}.md"`}});
};
