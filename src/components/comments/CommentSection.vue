<script setup lang="ts">
import { ref } from 'vue';
const props=defineProps<{enabled:boolean;repo:string;category:string;categoryId:string;term:string}>();const consent=ref(false);const loaded=ref(false);
function load(){if(!props.enabled||!props.repo||!props.category||!consent.value)return;loaded.value=true}
</script>
<template><section class="comment-section"><h2>討論</h2><p v-if="!enabled">留言功能尚未啟用。你仍可透過 GitHub 連結提出勘誤。</p><template v-else-if="!loaded"><p>載入 Giscus 會連線至 GitHub，並依其政策處理資料。你可以選擇是否載入。</p><label><input v-model="consent" type="checkbox" /> 我同意載入第三方留言元件</label><p><button class="button-secondary" type="button" :disabled="!consent" @click="load">載入留言</button></p></template><iframe v-else :src="`https://giscus.app/client.html?repo=${encodeURIComponent(repo)}&repoId=${encodeURIComponent(categoryId)}&category=${encodeURIComponent(category)}&mapping=term&term=${encodeURIComponent(term)}&strict=0&reactionsEnabled=1&emitMetadata=0&inputPosition=top&theme=preferred_color_scheme&lang=zh-TW`" title="Giscus 討論" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" /></section></template>
