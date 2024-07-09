

<template>
  <div class="container">
    <header class="profile-container">
      <Avatar size="xlarge" shape="circle" class="profile-image">
        <!-- TODO: hero image here-->
        
      </Avatar>
      <h1>{{ username }}</h1>
    </header>

    <h2>Decks</h2>
    <div class="deck-container">
      <DeckCard v-for="deck in deckData" :key="deck.id" :deck="(deck as any)" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/throwError";
import DeckCard from "@/components/DeckCard.vue";
import Avatar from "primevue/avatar";

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
  .eq("creator", userId);

if (error) {
  throwError(error);
  throw new Error();
}
</script>

<style scoped>
.container {
  padding: var(--content-padding);
}

.profile-container {
  display: flex;
  align-items: center;
}
.profile-image {
  margin-right: var(--inline-spacing);
  flex-shrink: 0;
}

.deck-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-block-spacing);
  justify-content: center;
}
</style>
