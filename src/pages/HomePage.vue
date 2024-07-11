<template>
  <main>
    <h1>Sprout</h1>

    <h2>Latest Decks</h2>
    <div class="deck-container">
      <DeckCard v-for="deck in deckData" :key="deck.id" :deck="(deck as any)" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/throwError";
import DeckCard from "@/components/DeckCard.vue";
const { supabase } = useSupabase();
import type { Deck } from "@/lib/types";

const { data: deckData, error } = await supabase
  .from("decks")
  .select("*")
  .order("created_at", { ascending: false })
  .eq("is_complete", true)
  .eq("is_private", false)
  .limit(6)
  .returns<Deck[]>();

if (error) {
  throwError(error);
  throw new Error();
}
// TODO: show loading. Is there a suspense somewhere????
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
</style>
