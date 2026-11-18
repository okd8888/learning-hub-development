<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
type Item = { stableId:string; slug:string; title:string; description:string; category:string; type:string; tags:string[]; publishedAt:string; updatedAt?:string; readingMinutes:number; featured:boolean; featuredOrder?:number };
const props = withDefaults(defineProps<{ items: Item[]; base: string; initialCategory?: string; initialType?: string; initialPage?: number; pageSize?: number }>(), { initialCategory:'', initialType:'', initialPage:1, pageSize:12 });
const typeOptions = [['tutorial','教學'],['note','筆記'],['review','評估'],['project','實作'],['resource','資源'],['reference','參考'],['reflection','心得']];
const category = ref(props.initialCategory); const type = ref(props.initialType); const query = ref(''); const sort = ref('updated'); const page = ref(props.initialPage);
const tagSelection = ref<string[]>([]);
const view=ref<'grid'|'list'>('grid');
const allTags = computed(() => [...new Set(props.items.flatMap(item => item.tags))].sort());
const filtered = computed(() => props.items.filter(item => {
  const text = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLocaleLowerCase();
  return (!category.value || item.category === category.value) && (!type.value || item.type === type.value) && (!query.value || text.includes(query.value.toLocaleLowerCase())) && (!tagSelection.value.length || tagSelection.value.some(tag => item.tags.includes(tag)));
}).sort((a,b) => sort.value === 'published' ? b.publishedAt.localeCompare(a.publishedAt) || a.stableId.localeCompare(b.stableId) : (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt) || a.stableId.localeCompare(b.stableId)));
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / props.pageSize)));
const shown = computed(() => filtered.value.slice((page.value - 1) * props.pageSize, page.value * props.pageSize));
watch([category,type,query,sort,tagSelection], () => { page.value=1; const url=new URL(location.href); category.value?url.searchParams.set('category',category.value):url.searchParams.delete('category'); type.value?url.searchParams.set('type',type.value):url.searchParams.delete('type'); query.value?url.searchParams.set('q',query.value):url.searchParams.delete('q'); tagSelection.value.length?url.searchParams.set('tag',tagSelection.value.join(',')):url.searchParams.delete('tag'); history.replaceState({},'',url); }, {deep:true});
function setView(value:'grid'|'list'){view.value=value;try{const key=`learninghub:${document.documentElement.dataset.siteId??'learning-hub'}:reader:v1`;localStorage.setItem(key,JSON.stringify({...JSON.parse(localStorage.getItem(key)??'{}'),schemaVersion:1,preferences:{view:value}}))}catch{}}
onMounted(()=>{const params=new URLSearchParams(location.search);if(!props.initialCategory&&params.has('category'))category.value=params.get('category')??'';if(!props.initialType&&params.has('type'))type.value=params.get('type')??'';query.value=params.get('q')??'';if(params.has('tag'))tagSelection.value=(params.get('tag')??'').split(',').filter(Boolean);try{const state=JSON.parse(localStorage.getItem(`learninghub:${document.documentElement.dataset.siteId??'learning-hub'}:reader:v1`)??'{}');if(state.preferences?.view==='list')view.value='list'}catch{}});
function href(item:Item) { return `${props.base.replace(/\/$/,'')}/articles/${item.slug}/` || `/articles/${item.slug}/`; }
const categoryLabel = (id:string) => ({ai:'AI 與人工智慧',development:'程式開發',infrastructure:'系統與基礎架構',data:'資料庫與數據分析',opensource:'開源專案研究','healthcare-it':'醫療資訊技術',design:'UI/UX 與產品設計',experience:'學習心得與實作經驗'} as Record<string,string>)[id] ?? id;
</script>
<template>
  <div class="article-explorer">
    <div class="filter-bar" role="search">
      <label>關鍵字 <input v-model="query" type="search" placeholder="搜尋標題、摘要、標籤" /></label>
      <label>分類 <select v-model="category"><option value="">全部分類</option><option v-for="item in [...new Set(items.map(i=>i.category))]" :key="item" :value="item">{{ categoryLabel(item) }}</option></select></label>
      <label>類型 <select v-model="type"><option value="">全部類型</option><option v-for="option in typeOptions" :key="option[0]" :value="option[0]">{{ option[1] }}</option></select></label>
      <label>標籤 <select v-model="tagSelection" multiple aria-label="標籤（可多選，同組採 OR）"><option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option></select></label>
      <label>排序 <select v-model="sort"><option value="updated">最近更新</option><option value="published">發布日期</option></select></label>
      <span class="filter-count">{{ filtered.length }} 篇</span>
      <div class="view-toggle" role="group" aria-label="檢視方式"><button type="button" :aria-pressed="view==='grid'" @click="setView('grid')">卡片</button><button type="button" :aria-pressed="view==='list'" @click="setView('list')">列表</button></div>
    </div>
    <div v-if="shown.length" class="article-grid" :class="{'is-list':view==='list'}">
      <article v-for="(item,index) in shown" :key="item.stableId" class="article-card" :style="`--card-index:${index}`">
        <div class="card-cover cover-art"><span>{{ item.category }}</span><i aria-hidden="true">{{ item.title.slice(0,1) }}</i><span class="cover-type">{{ typeOptions.find(x=>x[0]===item.type)?.[1] ?? item.type }}</span></div>
        <div class="card-content"><div class="card-kicker"><a :href="`${base}categories/${item.category}/`">{{ categoryLabel(item.category) }}</a></div><h2><a :href="href(item)">{{ item.title }}</a></h2><p>{{ item.description }}</p><div class="card-meta"><time>{{ item.updatedAt ?? item.publishedAt }}</time><span>{{ item.readingMinutes }} 分鐘</span><span :data-card-status="item.stableId"></span><button class="mini-save" type="button" :data-favorite="item.stableId" :aria-label="`收藏${item.title}`">☆</button></div></div>
      </article>
    </div>
    <div v-else class="empty-state">沒有符合條件的內容，請調整篩選條件。</div>
    <nav v-if="pageCount > 1" class="pagination" aria-label="文章分頁"><button type="button" :disabled="page===1" @click="page--">上一頁</button><button v-for="n in pageCount" :key="n" type="button" :aria-current="page===n?'page':undefined" @click="page=n">{{ n }}</button><button type="button" :disabled="page===pageCount" @click="page++">下一頁</button></nav>
  </div>
</template>
