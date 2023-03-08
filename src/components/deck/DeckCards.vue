<script lang="ts">
export default {
  name: "DeckCards",
};
</script>

<template>
  <div>
    <CardTable :isInDeck="true" :cards="cards" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import getCard from "@/lib/getCard";
import deck from "@/store/deck";
import CardTable from "@/components/deck/CardTable.vue";

const cards = computed(() =>
  Object.keys(deck.list)
    .map((e) => getCard(e))
    .sort((a, b) => (a.class > b.class ? 1 : -1))
);
</script>

<style scoped></style>
