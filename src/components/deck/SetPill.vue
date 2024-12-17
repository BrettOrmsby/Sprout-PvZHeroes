<template>
  <Badge :class="card.rarity"
    >{{ card.set.charAt(0).toUpperCase() + card.set.slice(1) }} -
    {{ card.rarity.charAt(0).toUpperCase() }}</Badge
  >
</template>

<script lang="ts" setup>
import { type Card } from '@/lib/types'
import Badge from 'primevue/badge'
defineProps<{ card: Card }>()
</script>

<style scoped>
.p-badge {
  margin: 0;
  color: #151515;
  font-size: 0.6em;
  border-radius: 100em;
}

.common {
  background-color: #f5f5dc;
}
.uncommon {
  background-color: #959a9d;
}
.rare {
  background-color: #ea9c45;
}
.super-rare {
  background-color: #885cd5;
}
.legendary {
  background: linear-gradient(to bottom right, #a158dc, #f462f4, #f3ea94, #c5f882, #5ba3f0);
}
.event {
  background-color: #e66d59;
}
</style>
