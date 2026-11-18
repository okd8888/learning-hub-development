import type { APIRoute } from 'astro';
import { getPublishedArticles } from '../../lib/content';
export const GET: APIRoute=async()=>{
 const articles=(await getPublishedArticles()).slice(0,100);const nodes=articles.map(article=>({id:article.data.stableId,label:article.data.title,url:`/articles/${article.data.slug}/`,tags:article.data.tags,category:article.data.category}));
 const edges:string[][]=[];for(let i=0;i<articles.length;i++)for(let j=i+1;j<articles.length;j++){const a=articles[i].data,b=articles[j].data;if(a.related.includes(b.stableId)||b.related.includes(a.stableId)||a.tags.some(tag=>b.tags.includes(tag)))edges.push([a.stableId,b.stableId]);}
 return new Response(JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),nodes,edges}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
};
