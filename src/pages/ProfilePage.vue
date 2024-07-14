<template>
  <main>
    <header>
      <div class="profile-container">
        <Avatar
          size="xlarge"
          shape="circle"
          class="profile-image"
          :image="getHero(user.profile_image).image"
        >
        </Avatar>
        <div>
          <h1>{{ user.username }}</h1>
          <p class="joined">
            Joined
            {{
              new Date(user.created_at)
                .toDateString()
                .replace(/^\S+\s|\d+\s/g, "")
            }}
          </p>
        </div>
      </div>
    </header>

    <Toolbar>
      <template #start>
        <RouterLink :to="{ name: 'CreateDeck' }" style="text-decoration: none">
          <Button label="New Deck" severity="secondary">
            <template #icon="iconClass">
              <Plus :class="iconClass.class" />
            </template>
          </Button>
        </RouterLink>
        <RouterLink
          :to="{ name: 'UserSettings', params: { username: user.username } }"
          style="text-decoration: none"
        >
          <Button label="Settings" severity="secondary">
            <template #icon="iconClass">
              <Settings :class="iconClass.class" />
            </template>
          </Button>
        </RouterLink>
      </template>
    </Toolbar>

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
import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import { Plus, Settings } from "lucide-vue-next";
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
  margin-bottom: var(--block-space);
}
.profile-image {
  margin-right: var(--inline-space);
  flex-shrink: 0;
  background-color: var(--p-surface-950);
}
h1 {
  margin: 0;
}
.joined {
  margin: 0;
  color: var(--p-text-muted-color);
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

.p-toolbar {
  margin: 0 auto;
  width: fit-content;
}
:deep(.p-toolbar-start) {
  display: flex;
  gap: var(--inline-space);
  justify-content: center;
  align-items: center;
}

:deep(:is(.p-toolbar-center, .p-toolbar-end)) {
  display: none;
}
</style>
