<template>
  <main>
    <header class="profile-container">
      <Avatar
        size="xlarge"
        shape="circle"
        class="profile-image"
        :image="getHero(user.profile_image).image"
      >
      </Avatar>
      <h1>{{ user.username }}</h1>
    </header>

    <h2>Decks</h2>
    <div class="deck-container" v-if="isLoading">
      <Skeleton
        v-for="index in 6"
        :key="index"
        class="deck-skeleton"
        height="175px"
      ></Skeleton>
    </div>
    <div class="deck-container" v-else>
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
import Skeleton from "primevue/skeleton";
import { computed } from "vue";
import type { Deck } from "@/lib/types";
import { onMounted } from "vue";
import user from "@/store/user";
import { ref } from "vue";

const { supabase } = useSupabase();

const isLoading = ref(true);
const deckData = ref<Deck[]>([]);

onMounted(async () => {
  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("creator", user.id)
    .returns<Deck[]>();

  if (error) {
    throwError(error);
    throw new Error();
  } else {
    deckData.value = data;
    isLoading.value = false;
  }
});

const sortedDecks = computed(() =>
  [...deckData.value].sort(
    (a, b) =>
      new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
  )
);
</script>

<style scoped>
.profile-container {
  display: flex;
  align-items: center;
}
.profile-image {
  margin-right: var(--inline-space);
  flex-shrink: 0;
  background-color: var(--p-surface-950);
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
.deck-skeleton {
  max-width: 400px;
  border-radius: (--p-card-border-radius);
}
</style>
