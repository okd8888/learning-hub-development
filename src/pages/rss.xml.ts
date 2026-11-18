import type { APIRoute } from 'astro';
import { getPublishedArticles,sortArticles } from '../lib/content';
import { withBase } from '../lib/urls';
import { siteConfig } from '../config/site';
const escape=(value:string)=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export const GET:APIRoute=async({site})=>{
 const articles=sortArticles(await getPublishedArticles());
 const home=new URL(withBase('/'),site).href;
 const items=articles.map(({data})=>`<item><title>${escape(data.title)}</title><link>${new URL(withBase(`/articles/${data.slug}/`),site).href}</link><guid isPermaLink="true">${new URL(withBase(`/articles/${data.slug}/`),site).href}</guid><description>${escape(data.description)}</description><pubDate>${new Date(`${data.updatedAt??data.publishedAt}T00:00:00+08:00`).toUTCString()}</pubDate></item>`).join('');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${home}</link><description>${escape(siteConfig.description)}</description><language>zh-Hant</language>${items}</channel></rss>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
};
