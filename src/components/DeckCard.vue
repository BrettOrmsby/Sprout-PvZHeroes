<template>
  <RouterLink :to="{ name: 'ViewDeck', params: { id: deck.id } }">
    <Card>
      <template #title>
        <div class="title-container">
          <Avatar size="normal" shape="circle" class="hero" :image="getHero(deck.hero).image">
          </Avatar>
          <h3>{{ deck.name }}</h3>
        </div>
      </template>
      <template #content>
        <p class="description">{{ deck.description }}</p>
        <div class="footer-container">
          <p class="last-updated">Last updated {{ timeSinceUpdate }}</p>
          <div class="hearts"><Heart /> {{ deck.hearts }}</div>
          <div class="visibility" v-if="showVisibility && deck.is_private">
            <Tag value="Private" severity="secondary" />
          </div>
        </div>
      </template>
    </Card>
  </RouterLink>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Heart } from 'lucide-vue-next'
import { Avatar, Card, Tag } from 'primevue'
import getHero from '@/lib/getHero'
import type { Deck } from '@/lib/types'

const props = defineProps<{
  deck: Deck
  showVisibility?: boolean
}>()

dayjs.extend(relativeTime)
const refreshDateKey = ref(0)
const timeSinceUpdate = computed(() => {
  // eslint-disable-next-line
  refreshDateKey.value
  const lastUpdated = dayjs(props.deck.last_updated).fromNow()
  return lastUpdated.startsWith('in') ? 'a few seconds ago' : lastUpdated
})

const interval = setInterval(() => ++refreshDateKey.value, 60000)
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
a {
  flex-grow: 1;
  max-width: 400px;
  width: 100%;
}
.p-card {
  width: 100%;
  height: 100%;
  border: 1px solid var(--p-content-border-color);
  transition-duration: var(--p-transition-duration);
}

.p-card:hover {
  border: 1px solid var(--p-primary-400);
}

.title-container {
  display: flex;
  align-items: center;
}

h3 {
  margin: 0;
}

.hero {
  margin-right: var(--inline-space);
  flex-shrink: 0;
  background-color: var(--p-surface-950);
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--block-space);
  margin-top: var(--inline-space);
  font-size: 0.8em;
}

.hearts {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(var(--inline-space) / 2);
}
.hearts svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}

.last-updated {
  color: var(--p-text-muted-color);
  margin: 0;
}
</style>
