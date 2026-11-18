import type { APIRoute } from 'astro';
import taxonomy from '../../config/taxonomy.json';
import { getPublishedArticles,getTaxonomyCounts } from '../../lib/content';
import { withBase } from '../../lib/urls';
export const GET: APIRoute=async()=>{
 const articles=await getPublishedArticles();
 const counts=getTaxonomyCounts(articles);
 const categories=taxonomy.categories.map((category)=>{
  const children=category.children.map((child)=>({id:child.id,label:child.label,count:counts[`${category.id}/${child.id}`],url:withBase(`/categories/${category.id}/${child.id}/`)}));
  return {id:category.id,label:category.label,count:counts[category.id],url:withBase(`/categories/${category.id}/`),children};
 });
 return new Response(JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),categories,total:articles.length}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
};
