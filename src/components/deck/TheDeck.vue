<template>
  <h2>Deck</h2>
  <Message v-if="cards.length === 0" :severity="'warn'" :closable="false"
    >The Deck Is Empty</Message
  >
  <div v-else class="library-container">
    <template v-if="isUsersDeck">
      <PVZCardWithMenu
        v-for="card in cards"
        :key="card.name"
        :isInDeck="true"
        :card="card"
        :class="`${
          states.deckFilter.cardsMatchingFilter.includes(card.name) &&
          'highlighted'
        } ${
          states.deckFilter.hideCards &&
          !states.deckFilter.cardsMatchingFilter.includes(card.name) &&
          'hidden'
        }`"
      />
    </template>
    <template v-else>
      <PVZCard
        v-for="card in cards"
        :key="card.name"
        :card="card"
        :amount="deck.list[card.name]"
        :isValid="true"
        @click="showCard(card.name)"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import getCard from "@/lib/getCard";
import deck from "@/store/deck";
import PVZCardWithMenu from "@/components/deck/PVZCardWithMenu.vue";
import PVZCard from "@/components/PVZCard.vue";
import Message from "primevue/message";
import states from "@/store/states";
import useAuthUser from "@/composables/UseAuthUser";

const { id } = useAuthUser();
const isUsersDeck = computed(() => id.value === deck.creator);

const cards = computed(() =>
  Object.keys(deck.list)
    .map((e) => getCard(e))
    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name))
);

const showCard = (card: string) => {
  states.cardModal.card = card;
  states.cardModal.show = true;
};
</script>

<style scoped>
.library-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--inline-space);
  justify-content: flex-start;
}
:deep(.hidden) {
  display: none;
}
:deep(.highlighted) {
  box-shadow: 0 0 3px 3px var(--p-yellow-400);
}
</style>
