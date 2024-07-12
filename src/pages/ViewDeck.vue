<template>
  <CardModal />
  <HeroModal />
  <DeckHeader />
  <main>
    <DeckToolbar />
    <TheDeck />
    <AddCards v-if="isUsersDeck" />
    <DeckCharts />
  </main>
  <DeckFooter />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import useSupabase from "@/composables/UseSupabase";
import useAuthUser from "@/composables/UseAuthUser";
import deck from "@/store/deck";
import { computed } from "vue";
import DeckHeader from "@/components/deck/DeckHeader.vue";
import TheDeck from "@/components/deck/TheDeck.vue";
import AddCards from "@/components/deck/AddCards.vue";
import CardModal from "@/components/CardModal.vue";
import HeroModal from "@/components/deck/HeroModal.vue";
import DeckFooter from "@/components/deck/DeckFooter.vue";
import DeckCharts from "@/components/deck/DeckCharts.vue";
import DeckToolbar from "@/components/deck/DeckToolbar.vue";
import type { Deck } from "@/lib/types";

const props = defineProps<{ id: string }>();

const { supabase } = useSupabase();
const { id } = useAuthUser();
const isUsersDeck = computed(() => id.value === deck.creator);
const router = useRouter();

const { data } = await supabase
  .from("decks")
  .select()
  .eq("id", props.id)
  .returns<Deck[]>()
  .single();

if (data) {
  Object.assign(deck, data);
} else {
  router.push({ name: "404" });
}
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
