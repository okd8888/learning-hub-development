<script setup lang="ts">
defineProps<{ id:string;status: string; results: Array<{ url: string; title: string; excerpt: string }>;hasMore?:boolean }>();
defineEmits<{ retry: [];more:[] }>();
</script>
<template>
  <div class="search-results" :id="id" aria-live="polite">
    <p v-if="status === 'idle'">輸入關鍵字開始搜尋。</p>
    <p v-else-if="status === 'loading'">正在搜尋…</p>
    <div v-else-if="status === 'error'" class="search-empty"><p>搜尋索引暫時無法載入。</p><button type="button" @click="$emit('retry')">重試</button></div>
    <p v-else-if="!results.length">沒有找到符合的內容，試試其他關鍵字。</p>
    <a v-for="result in results" :key="result.url" class="search-result" :href="result.url"><strong>{{ result.title }}</strong><span>{{ result.excerpt }}</span></a>
    <button v-if="hasMore" class="search-more" type="button" @click="$emit('more')">載入更多結果</button>
  </div>
</template>
