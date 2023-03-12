<script lang="ts">
export default {
  name: "AddCards",
};
</script>

<template>
  <div>
    <h2>Library</h2>

    <TabView ref="tabview1">
      <TabPanel v-for="(value, key) in cardByClass" :key="key">
        <template #header>
          <div style="white-space: pre">
            {{ key }}
          </div>
        </template>
        <CardTable :isInDeck="false" :cards="value" />
      </TabPanel>
    </TabView>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import deck from "@/store/deck";
import heroData from "@/assets/heros.json";
import plants from "@/assets/plants.json";
import zombies from "@/assets/zombies.json";
import type { Card } from "@/lib/types";
import CardTable from "./CardTable.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";

const isPlant = computed(() =>
  heroData.plants.some((e) => e.name === deck.hero)
);

const cards = computed(
  () =>
    (isPlant.value ? plants : zombies).filter(
      (e) =>
        e.class !== "Removed" && e.set !== "token" && e.set !== "superpower"
    ) as Card[]
);

const cardByClass = computed(() => {
  const cardClassObj: Record<string, Card[]> = {};
  for (const card of cards.value) {
    if (!cardClassObj[card.class]) {
      cardClassObj[card.class] = [card];
    } else {
      cardClassObj[card.class].push(card);
    }
  }
  return cardClassObj;
});
</script>

<style scoped>
:deep() .p-tabview-nav-link {
  background: var(--primary) !important;
  color: var(--primary-color-text) !important;
}
:deep():is(.p-tabview-nav-link:hover, .p-highlight a) {
  background: var(--primary-hover) !important;
}
:deep().p-tabview-panels {
  padding: 0;
}
</style>
