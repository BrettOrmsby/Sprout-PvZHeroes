<template>
  <main>
    <h1><Sprout class="sprout" />Sprout</h1>
    <div class="subtitle">A deck building website for Plants vs. Zombies Heros.</div>
    <Message style="margin-top: var(--inline-space)"
      >Card texts have been changed following the recent update. Images may take longer to be
      updated. Please report any discrepancies to the
      <a
        href="https://github.com/BrettOrmsby/Sprout-PvZHeroes"
        style="color: inherit; text-decoration: underline"
        target="_blank"
        >Github</a
      >.</Message
    >

    <div v-if="isSignedIn">
      <h2>Your Latest Decks</h2>
      <div class="deck-container" v-if="isLoadingYourDecks">
        <Skeleton v-for="index in 4" :key="index" class="deck-skeleton" height="175px"></Skeleton>
      </div>
      <Message v-else-if="isErrorYourDecks" severity="error"> Failed to load decks. </Message>
      <Message v-else-if="yourDecks.length === 0" severity="warn"> You own no decks. </Message>
      <div class="deck-container" v-else>
        <DeckCard v-for="deck in yourDecks" :key="deck.id" :deck="deck" :show-visibility="true" />
      </div>
      <router-link to="/me" v-if="isLoadingYourDecks || yourDecks.length > 0">
        <Button label="View all personal decks" link />
      </router-link>
    </div>

    <h2>Latest Public Decks</h2>
    <div class="deck-container" v-if="isLoading">
      <Skeleton v-for="index in 6" :key="index" class="deck-skeleton" height="175px"></Skeleton>
    </div>
    <Message v-else-if="isError" severity="error"> Failed to load decks. </Message>
    <div class="deck-container" v-else>
      <DeckCard v-for="deck in decks" :key="deck.id" :deck="deck" />
    </div>
    <router-link to="/search/decks">
      <Button label="View all public decks" link />
    </router-link>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { Button, Message, Skeleton } from 'primevue'
import { Sprout } from 'lucide-vue-next'
import useAuthUser from '@/composables/UseAuthUser'
import DeckCard from '@/components/DeckCard.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useUserDecks } from '@/composables/useUserDecks'
import { useCompleteDecks } from '@/composables/home/UseCompleteDecks'

const { id, isSignedIn } = useAuthUser()

const { decks, isLoading, isError } = useCompleteDecks()
const {
  decks: yourDecks,
  isLoading: isLoadingYourDecks,
  isError: isErrorYourDecks,
} = useUserDecks(id, 'created_at', 4)
</script>

<style scoped>
main {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}
main :deep(p) {
  text-align: left;
}

h1 {
  font-size: 4rem;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--inline-space);
  gap: var(--inline-space);
}

.sprout {
  width: 1em;
  height: 1em;
  color: var(--p-primary-400);
  flex-shrink: 0;
}

.subtitle {
  color: var(--p-text-muted-color);
}

h1,
h2,
.subtitle {
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
  border-radius: var(--p-card-border-radius);
}
</style>
