<template>
  <RouterLink
    :to="{ name: 'ViewDeck', params: { id: deck.id } }"
    class="deck-card"
  >
    <Card>
      <template #title>
        <div class="title-container">
          <Avatar
            size="medium"
            shape="circle"
            class="hero"
            :image="getHero(deck.hero).image"
          >
          </Avatar>
          <h3>{{ deck.name }}</h3>
        </div>
      </template>
      <template #content>
        <p class="description">{{ deck.description }}</p>
        <div class="footer-container">
          <p class="last-updated">Last updated {{ timeSinceUpdate }}</p>
          <div class="visibility" v-if="showVisibility">
            <Tag v-if="deck.is_private" value="Private" severity="secondary" />
          </div>
        </div>
      </template>
    </Card>
  </RouterLink>
</template>

<script lang="ts" setup>
import { computed, ref, onUnmounted } from "vue";
import type { Deck } from "@/lib/types";
import getHero from "@/lib/getHero";
import Avatar from "primevue/avatar";
import Card from "primevue/card";
import Tag from "primevue/tag";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const props = defineProps<{
  deck: Deck;
  showVisibility?: boolean;
}>();

const refreshDateKey = ref(0);
const timeSinceUpdate = computed(() => {
  refreshDateKey.value;
  let lastUpdated = dayjs(props.deck.last_updated).fromNow();
  if (lastUpdated.startsWith("in")) {
    return "a few seconds ago";
  }
  return dayjs(props.deck.last_updated).fromNow();
});

const interval = setInterval(() => ++refreshDateKey.value, 60000);

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
a {
  flex-grow: 1;
  max-width: 400px;
}
.p-card {
  width: 100%;
  height: 100%;
  border: 1px solid var(--p-content-border-color);
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
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.footer-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--inline-space);
  margin-top: var(--inline-space);
}

.last-updated {
  color: var(--p-text-muted-color);
  margin: 0;
  font-size: 0.8em;
}
</style>
