<template>
  <Panel :class="type">
    <template #header>
      <span class="p-panel-title"><component :is="icons[type]" /> {{ headers[type] }}</span>
    </template>
    <slot />
  </Panel>
</template>

<script lang="ts" setup>
import Panel from 'primevue/panel'
import { Lightbulb, TriangleAlert, Info, CircleX } from 'lucide-vue-next'
defineProps<{ type: 'tip' | 'note' | 'warning' | 'error' }>()

const headers = {
  tip: 'Tip',
  note: 'Note',
  warning: 'Warning',
  error: 'Possible Errors',
}

const icons = {
  tip: Lightbulb,
  note: Info,
  warning: TriangleAlert,
  error: CircleX,
}
</script>

<style scoped>
/* Colours from primevue message component */
.tip {
  --background: color-mix(in srgb, var(--p-green-500), transparent 84%);
  --border-color: color-mix(in srgb, var(--p-green-700), transparent 64%);
  --color: var(--p-green-500);
}
.note {
  --background: color-mix(in srgb, var(--p-blue-500), transparent 84%);
  --border-color: color-mix(in srgb, var(--p-blue-700), transparent 64%);
  --color: var(--p-blue-500);
}
.warning {
  --background: color-mix(in srgb, var(--p-yellow-500), transparent 84%);
  --border-color: color-mix(in srgb, var(--p-yellow-700), transparent 64%);
  --color: var(--p-yellow-500);
}
.error {
  --background: color-mix(in srgb, var(--p-red-500), transparent 84%);
  --border-color: color-mix(in srgb, var(--p-red-700), transparent 64%);
  --color: var(--p-red-500);
}
.p-panel {
  margin-bottom: var(--block-space);
  color: var(--color);
  background-color: var(--background);
  border: 1px solid var(--border-color);
}
.p-panel-title {
  color: var(--color);
  display: flex;
  align-items: center;
  gap: var(--inline-space);
}
:deep(.p-panel-content-container p:first-child) {
  margin-top: 0;
}
:deep(.p-panel-content-container p:last-child) {
  margin-bottom: 0;
}
</style>
