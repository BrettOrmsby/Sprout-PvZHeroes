<template>
  <div class="library-container">
    <Message v-if="cards.length === 0" :severity="'warn'" :closable="false"
      >Deck Empty</Message
    >
    <template v-else>
      <PVZCard
        v-for="card in cards"
        :key="card.name"
        :isInDeck="true"
        :card="card"
    /></template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import getCard from "@/lib/getCard";
import deck from "@/store/deck";
import PVZCard from "@/components/deck/PVZCard.vue";
import Message from "primevue/message";

const cards = computed(() =>
  Object.keys(deck.list)
    .map((e) => getCard(e))
    .sort((a, b) => (a.class > b.class ? 1 : -1))
);
</script>

<style scoped>
.library-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--inline-block-spacing);
  padding: var(--content-padding);
  justify-content: flex-start;
}
</style>
