
<template>
  <div class="container">
    <h1>Name</h1>

    <div class="deck-container">
      <DeckCard v-for="deck in deckData" :key="deck.id" :deck="(deck as any)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/throwError";
import DeckCard from "@/components/DeckCard.vue";
const { supabase } = useSupabase();

const { data: deckData, error } = await supabase
  .from("decks")
  .select("*")
  .order("created_at", { ascending: false })
  .eq("is_complete", true)
  .eq("is_private", false)
  .limit(6);

if (error) {
  throwError(error);
  throw new Error();
}
</script>

<style scoped>
h1 {
  text-align: center;
}

.container {
  padding: var(--content-padding);
}
.deck-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-block-spacing);
  justify-content: center;
}
</style>
