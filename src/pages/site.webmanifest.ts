import type { APIRoute } from 'astro';
import { withBase } from '../lib/urls';
export const GET:APIRoute=()=>new Response(JSON.stringify({name:'LearningHub',short_name:'LearningHub',start_url:withBase('/'),display:'standalone',background_color:'#f6f7f2',theme_color:'#b9ed3e',lang:'zh-Hant'}),{headers:{'Content-Type':'application/manifest+json; charset=utf-8'}});
