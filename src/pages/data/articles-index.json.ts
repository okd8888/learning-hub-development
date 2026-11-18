import type { APIRoute } from 'astro';
import { getPublishedArticles,getReadingMinutes,sortArticles } from '../../lib/content';
import { withBase } from '../../lib/urls';
export const GET: APIRoute = async () => {
  const articles=sortArticles(await getPublishedArticles());
  return new Response(JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),articles:articles.map(({data,body})=>({stableId:data.stableId,slug:data.slug,title:data.title,description:data.description,category:data.category,subcategory:data.subcategory,type:data.type,tags:data.tags,publishedAt:data.publishedAt,updatedAt:data.updatedAt,readingMinutes:getReadingMinutes(body??''),url:withBase(`/articles/${data.slug}/`),featured:data.featured,difficulty:data.difficulty}))}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
};
