<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
const preference = ref<'light' | 'dark' | 'system'>('system');
const storageKey = () => `learninghub:${document.documentElement.dataset.siteId ?? 'learning-hub'}:theme`;
const label = computed(() => preference.value === 'system' ? '系統主題' : preference.value === 'light' ? '淺色主題' : '深色主題');
function apply() {
  const dark = preference.value === 'dark' || (preference.value === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
}
function cycle() {
  preference.value = preference.value === 'system' ? 'light' : preference.value === 'light' ? 'dark' : 'system';
  localStorage.setItem(storageKey(), preference.value);
  apply();
}
onMounted(() => {
  const saved = localStorage.getItem(storageKey());
  if (saved === 'light' || saved === 'dark' || saved === 'system') preference.value = saved;
  apply();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);
});
</script>
<template><button class="icon-button theme-toggle" type="button" :aria-label="label" :title="label" @click="cycle"><span aria-hidden="true">{{ preference === 'dark' ? '☾' : preference === 'light' ? '☀' : '◐' }}</span></button></template>
