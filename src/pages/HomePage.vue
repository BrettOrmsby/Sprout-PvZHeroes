<template>
  <main>
    <h1>Sprout</h1>

    <h2>Latest Decks</h2>
    <div class="deck-container" v-if="isLoading">
      <Skeleton
        v-for="index in 6"
        :key="index"
        class="deck-skeleton"
        height="175px"
      ></Skeleton>
    </div>
    <div class="deck-container" v-else>
      <DeckCard v-for="deck in deckData" :key="deck.id" :deck="(deck as any)" />
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/throwError";
import DeckCard from "@/components/DeckCard.vue";
const { supabase } = useSupabase();
import type { Deck } from "@/lib/types";
import { ref, onMounted } from "vue";
import Skeleton from "primevue/skeleton";
import TheFooter from "@/components/TheFooter.vue";

const isLoading = ref(true);
const deckData = ref<Deck[]>([]);

onMounted(async () => {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("is_complete", true)
    .eq("is_private", false)
    .limit(6)
    .returns<Deck[]>();

  if (error) {
    throwError(error);
  } else {
    deckData.value = data;
    isLoading.value = false;
  }
});
</script>

<style scoped>
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

.deck-skeleton {
  max-width: 400px;
  border-radius: (--p-card-border-radius);
}
</style>
