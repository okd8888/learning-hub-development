<script setup lang="ts">
import { computed, ref } from 'vue';
const props=defineProps<{tool:'json'|'base64'}>();const input=ref('');const error=ref('');const output=ref('');
const title=computed(()=>props.tool==='json'?'JSON 格式整理':'Base64 文字轉換');
function run(){error.value='';output.value='';try{if(props.tool==='json'){output.value=JSON.stringify(JSON.parse(input.value),null,2);return}const encoded=/^[A-Za-z0-9+/]*={0,2}$/.test(input.value.trim())&&input.value.trim().length%4===0;if(encoded){const bytes=Uint8Array.from(atob(input.value.trim()),c=>c.charCodeAt(0));output.value=new TextDecoder().decode(bytes);}else output.value=btoa(String.fromCharCode(...new TextEncoder().encode(input.value)));}catch{error.value=props.tool==='json'?'JSON 格式錯誤，請檢查逗號、引號與括號。':'Base64 文字無法解碼。'}}
function reset(){input.value='';output.value='';error.value=''}
</script>
<template><section class="tool-host"><h2>{{ title }}</h2><p>所有處理都在你的瀏覽器中進行，內容不會傳送到伺服器。</p><form class="tool-form" @submit.prevent="run"><label for="tool-input">輸入</label><textarea id="tool-input" v-model="input" spellcheck="false" placeholder="貼上要處理的文字"></textarea><div><button class="button-primary" type="submit">執行</button> <button class="button-secondary" type="button" @click="reset">清除</button></div><p v-if="error" role="alert">{{ error }}</p><label v-if="output" for="tool-output">結果</label><textarea v-if="output" id="tool-output" readonly :value="output"></textarea></form></section></template>
