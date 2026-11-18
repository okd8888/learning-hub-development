import { getCollection, type CollectionEntry } from 'astro:content';
import taxonomy from '../config/taxonomy.json';
export { getReadingMinutes } from './reading-time';

export type Article = CollectionEntry<'articles'>;

function todayTaipei() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());
}

export async function getPublishedArticles(): Promise<Article[]> {
  const today = todayTaipei();
  const all = await getCollection('articles');
  return all.filter(({ data }) => !data.draft && data.publishedAt <= today && (!data.updatedAt || data.updatedAt <= today));
}

export function sortArticles(articles: Article[]): Article[] {
  return [...articles].sort((a, b) =>
    (b.data.updatedAt ?? b.data.publishedAt).localeCompare(a.data.updatedAt ?? a.data.publishedAt)
      || a.data.stableId.localeCompare(b.data.stableId));
}

export function getTaxonomyCounts(articles: Article[]) {
  const counts:Record<string,number>={all:articles.length};
  for(const category of taxonomy.categories){
    const inCategory=articles.filter(article=>article.data.category===category.id);
    counts[category.id]=inCategory.length;
    for(const child of category.children)counts[`${category.id}/${child.id}`]=inCategory.filter(article=>article.data.subcategory===child.id).length;
  }
  return counts;
}

export function getRelatedArticles(article: Article, articles: Article[], limit = 4) {
  const candidates = articles.filter((item) => item.id !== article.id);
  return candidates.map((item) => {
    const sharedTags = item.data.tags.filter((tag) => article.data.tags.includes(tag)).length;
    const score = sharedTags * 3 + Number(item.data.subcategory === article.data.subcategory && !!item.data.subcategory) * 2 + Number(item.data.category === article.data.category);
    const manual = article.data.related.includes(item.data.stableId) ? 1000 : 0;
    return { item, score: score + manual };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.item.data.stableId.localeCompare(b.item.data.stableId)).slice(0, limit).map(({ item }) => item);
}
