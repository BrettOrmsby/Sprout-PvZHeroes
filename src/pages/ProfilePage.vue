<template>
  <main>
    <header class="profile-container">
      <Avatar
        size="xlarge"
        shape="circle"
        class="profile-image"
        :image="getHero(profileImage).image"
      >
      </Avatar>
      <h1>{{ username }}</h1>
    </header>

    <h2>Decks</h2>
    <div class="deck-container">
      <DeckCard
        v-for="deck in sortedDecks"
        :key="deck.id"
        :deck="(deck as any)"
        showVisibility
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/throwError";
import DeckCard from "@/components/DeckCard.vue";
import getHero from "@/lib/getHero";
import Avatar from "primevue/avatar";
import { computed } from "vue";
import type { Deck } from "@/lib/types";
// TODO: loading here too
// TODO: new deck button
const props = defineProps<{ username: string }>();

const { supabase } = useSupabase();

const { data: query, error: userError } = await supabase
  .from("profiles")
  .select("username, profile_image, id")
  .eq("username", props.username)
  .single();

if (userError) {
  throwError(userError);
  throw new Error();
}

const userId = query.id;
const profileImage = query.profile_image;

const { data: deckData, error } = await supabase
  .from("decks")
  .select("*")
  .eq("creator", userId)
  .returns<Deck[]>();

if (error) {
  throwError(error);
  throw new Error();
}

const sortedDecks = computed(() =>
  deckData!.sort(
    (a, b) =>
      new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  )
);

if (error) {
  throwError(error);
  throw new Error();
}
</script>

<style scoped>
.profile-container {
  display: flex;
  align-items: center;
}
.profile-image {
  margin-right: var(--inline-space);
  flex-shrink: 0;
}

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
