<template>
  <CardModal />
  <main>
    <h1>Comparing {{ deck.name }}</h1>
    <CompareInput :id="id" v-model="toInput" />

    <template v-for="(value, key) in comparison" :key="key">
      <h2>
        {{
          key === "both"
            ? "Shared in Both Decks"
            : `Unique to ${getDeck(key as string).name}`
        }}
        ({{ Object.values(value).reduce((prev, curr) => prev + curr, 0) }})
      </h2>
      <Message
        v-if="Object.values(value).length === 0"
        :severity="'warn'"
        :closable="false"
        >No Unique Cards</Message
      >
      <div v-else class="card-group">
        <ComparePVZCard
          v-for="card in sortList(value)"
          :key="card.name"
          :card="card"
          :amount="value[card.name]"
        />
      </div>
    </template>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import CompareInput from "@/components/CompareInput.vue";
import Message from "primevue/message";
import ComparePVZCard from "@/components/ComparePVZCard.vue";
import CardModal from "@/components/CardModal.vue";
import TheFooter from "@/components/TheFooter.vue";
import { ref, computed } from "vue";
import getCard from "@/lib/getCard";
import deck, { compareDeck } from "@/store/deck";

defineProps<{ id: string; to: string }>();

const getDeck = (id: string) => (deck.id === id ? deck! : compareDeck!);

const sortList = (list: Record<string, number>) =>
  Object.keys(list)
    .map((e) => getCard(e))
    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));

const comparison = computed(() => {
  const comparison = {
    [deck.id]: {} as Record<string, number>,
    [compareDeck.id]: {},
    both: {} as Record<string, number>,
  };

  for (const [name, amount] of Object.entries(deck.list)) {
    if (name in compareDeck.list) {
      if (compareDeck.list[name] < amount) {
        comparison[deck.id][name] = amount - compareDeck.list[name];
        comparison.both[name] = compareDeck.list[name];
      } else if (compareDeck.list[name] === amount) {
        comparison.both[name] = compareDeck.list[name];
      }
    } else {
      comparison[deck.id][name] = amount;
    }
  }

  for (const [name, amount] of Object.entries(compareDeck.list)) {
    if (name in deck.list) {
      if (deck.list[name] < amount) {
        comparison[compareDeck.id][name] = amount - deck.list[name];
        comparison.both[name] = deck.list[name];
      }
    } else {
      comparison[compareDeck.id][name] = amount;
    }
  }

  return comparison;
});

const toInput = ref(
  "https://sprout-deckbuider.vercel.app/deck/" + compareDeck.id
);
</script>

<style scoped>
h1,
h2 {
  text-align: center;
}

.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}
</style>
