<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import SearchResults from './SearchResults.vue';
import taxonomy from '../../config/taxonomy.json';
const props = withDefaults(defineProps<{ base: string; fullPage?: boolean; initialQuery?: string }>(), { fullPage: false, initialQuery: '' });
const query = ref(props.initialQuery); const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle');
const results = ref<Array<{ url: string; title: string; excerpt: string }>>([]); const type = ref(''); const category=ref(''); const tags=ref<string[]>([]); const visibleCount=ref(10); const activeIndex=ref(-1);
let pagefind: any; let timer: number | undefined; let requestNo = 0;
const base = computed(() => props.base.endsWith('/') ? props.base : `${props.base}/`);
async function ensurePagefind() {
  if (pagefind) return pagefind;
  const path = new URL(`${base.value}pagefind/pagefind.js`, location.origin).href;
  pagefind = await import(/* @vite-ignore */ path);
  await pagefind.init(); return pagefind;
}
async function searchNow() {
  const current = ++requestNo; const term = query.value.trim();
  if (!term) { results.value = []; status.value = 'idle'; return; }
  status.value = 'loading';
  try {
    const engine = await ensurePagefind();
    const filters:Record<string,string[]>={};if(type.value)filters.type=[type.value];if(category.value)filters.category=[category.value];if(tags.value.length)filters.tag=tags.value;
    const found = await engine.search(term, Object.keys(filters).length ? { filters } : {});
    const records = await Promise.all(found.results.map((result: any) => result.data()));
    if (current !== requestNo) return;
    results.value = records.map((row: any) => ({ url: row.url, title: row.meta?.title ?? '未命名文章', excerpt: new DOMParser().parseFromString(row.excerpt ?? '', 'text/html').body.textContent ?? '' }));
    visibleCount.value=10;activeIndex.value=-1;
    status.value = 'ready';
  } catch { if (current === requestNo) status.value = 'error'; }
}
function scheduleSearch() { window.clearTimeout(timer); timer = window.setTimeout(searchNow, 200); }
function showMore(){visibleCount.value=Math.min(results.value.length,visibleCount.value+10)}
function onKeydown(event:KeyboardEvent){if(event.key==='ArrowDown'&&results.value.length){event.preventDefault();activeIndex.value=Math.min(visibleCount.value-1,activeIndex.value+1);document.querySelectorAll<HTMLAnchorElement>('.search-result')[activeIndex.value]?.focus()}else if(event.key==='ArrowUp'&&results.value.length){event.preventDefault();activeIndex.value=Math.max(0,activeIndex.value-1);document.querySelectorAll<HTMLAnchorElement>('.search-result')[activeIndex.value]?.focus()}else if(event.key==='Enter'&&activeIndex.value>=0){document.querySelectorAll<HTMLAnchorElement>('.search-result')[activeIndex.value]?.click()}}
watch([query, type, category, tags], scheduleSearch, {deep:true});
onMounted(() => { if (!query.value) query.value=new URLSearchParams(location.search).get('q')??''; if (query.value) searchNow(); });
</script>
<template>
  <div v-if="!fullPage" class="search-dialog" data-search-dialog aria-hidden="true" role="dialog" aria-modal="true" aria-label="站內搜尋">
    <div class="search-panel" @keydown="onKeydown">
      <div class="search-field"><span aria-hidden="true">⌕</span><input v-model="query" type="search" placeholder="搜尋文章、標籤或主題…" autocomplete="off" aria-controls="search-results-list" /><button type="button" data-search-close aria-label="關閉搜尋">Esc</button></div>
      <div class="search-filters"><label>分類 <select v-model="category"><option value="">全部</option><option v-for="item in taxonomy.categories" :key="item.id" :value="item.id">{{ item.label }}</option></select></label><label>類型 <select v-model="type"><option value="">全部</option><option value="tutorial">教學</option><option value="note">筆記</option><option value="review">評估</option><option value="project">實作</option></select></label><label>標籤 <select v-model="tags" multiple aria-label="標籤（可多選，同組採 OR）"><option v-for="item in taxonomy.tags" :key="item.id" :value="item.id">{{ item.label }}</option></select></label><a :href="`${base}search/?q=${encodeURIComponent(query)}`">進階搜尋 →</a></div>
      <SearchResults id="search-results-list" :status="status" :results="results.slice(0,visibleCount)" :has-more="visibleCount<results.length" @more="showMore" @retry="searchNow" />
      <p class="search-hint">↑ ↓ 瀏覽結果 · Enter 開啟 · Esc 關閉</p>
    </div>
  </div>
  <section v-else class="search-page-widget" aria-label="搜尋結果">
    <div class="search-field search-page-field"><span aria-hidden="true">⌕</span><input v-model="query" type="search" placeholder="搜尋文章、標籤或主題…" autocomplete="off" aria-controls="search-page-results" /><button type="button" @click="searchNow">搜尋</button></div>
    <div class="search-filters"><label>分類 <select v-model="category"><option value="">全部</option><option v-for="item in taxonomy.categories" :key="item.id" :value="item.id">{{ item.label }}</option></select></label><label>類型 <select v-model="type"><option value="">全部</option><option value="tutorial">教學</option><option value="note">筆記</option><option value="review">評估</option><option value="project">實作</option></select></label><label>標籤 <select v-model="tags" multiple aria-label="標籤（可多選，同組採 OR）"><option v-for="item in taxonomy.tags" :key="item.id" :value="item.id">{{ item.label }}</option></select></label></div>
    <SearchResults id="search-page-results" :status="status" :results="results.slice(0,visibleCount)" :has-more="visibleCount<results.length" @more="showMore" @retry="searchNow" />
  </section>
</template>
