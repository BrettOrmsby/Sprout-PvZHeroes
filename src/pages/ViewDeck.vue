<template>
  <CardModal />
  <HeroModal />
  <DeckHeader />
  <main>
    <DeckToolbar />
    <TheDeck />
    <AddCards v-if="isUsersDeck" />
    <DeckCharts />
    <DrawSimulator />
  </main>
  <DeckFooter />
  <TheFooter />
</template>

<script lang="ts" setup>
import useAuthUser from "@/composables/UseAuthUser";
import deck from "@/store/deck";
import { computed } from "vue";
import DeckHeader from "@/components/deck/DeckHeader.vue";
import TheDeck from "@/components/deck/TheDeck.vue";
import AddCards from "@/components/deck/AddCards.vue";
import CardModal from "@/components/CardModal.vue";
import HeroModal from "@/components/deck/HeroModal.vue";
import DeckFooter from "@/components/deck/DeckFooter.vue";
import DrawSimulator from "@/components/deck/DrawSimulator.vue";
import DeckCharts from "@/components/deck/DeckCharts.vue";
import DeckToolbar from "@/components/deck/DeckToolbar.vue";
import TheFooter from "@/components/TheFooter.vue";

import throwError from "@/lib/throwError";
import useSupabase from "@/composables/UseSupabase";
import useHoverShortcut from "@/composables/useHoverShortcut";

useHoverShortcut({
  Digit1: {
    selector: "[data-card-name][data-can-add=true]",
    command(element: Element) {
      const cardName = element.getAttribute("data-card-name")!;
      const newAmount = deck.list[cardName] ? deck.list[cardName] + 1 : 1;
      const newList = { ...deck.list, [cardName]: newAmount };
      updateDeck(newList);
    },
  },
  Digit2: {
    selector: "[data-card-name][data-can-remove=true]",
    command(element: Element) {
      const cardName = element.getAttribute("data-card-name")!;

      const newAmount = deck.list[cardName] - 1;
      const newList = { ...deck.list, [cardName]: newAmount };
      if (newList[cardName] === 0) {
        delete newList[cardName];
      }
      updateDeck(newList);
    },
  },
});

const { supabase } = useSupabase();
const updateDeck = async (newList: Record<string, number>) => {
  const { data, error } = await supabase
    .from("decks")
    .update({
      list: newList,
      is_complete:
        Object.values(newList).reduce((prev, curr) => prev + curr, 0) === 40,
    })
    .eq("id", deck.id)
    .select()
    .single();

  if (error) {
    throwError(error);
    return;
  }
  Object.assign(deck, data);
};

const { id } = useAuthUser();
const isUsersDeck = computed(() => id.value === deck.creator);
</script>

<style scoped>
.overflow {
  overflow: scroll;
}
h1,
h2 {
  text-align: center;
}

.deck-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}

main {
  margin-top: 0;
}
</style>
