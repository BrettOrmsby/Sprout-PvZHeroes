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
      <Message v-else-if="yourDeckData.length === 0" severity="warn"> You own no decks </Message>
      <div class="deck-container" v-else>
        <DeckCard
          v-for="deck in yourDeckData"
          :key="deck.id"
          :deck="deck as any"
          :show-visibility="true"
        />
      </div>
      <router-link to="/me" v-if="isLoadingYourDecks || yourDeckData.length > 0">
        <Button label="View all personal decks" link />
      </router-link>
    </div>

    <h2>Latest Public Decks</h2>
    <div class="deck-container" v-if="isLoading">
      <Skeleton v-for="index in 6" :key="index" class="deck-skeleton" height="175px"></Skeleton>
    </div>
    <div class="deck-container" v-else>
      <DeckCard v-for="deck in deckData" :key="deck.id" :deck="deck as any" />
    </div>
    <router-link to="/search/decks">
      <Button label="View all public decks" link />
    </router-link>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Button, Message, Skeleton } from 'primevue'
import { Sprout } from 'lucide-vue-next'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import DeckCard from '@/components/DeckCard.vue'
import TheFooter from '@/components/TheFooter.vue'
import throwError from '@/lib/throwError'
import type { Deck } from '@/lib/types'

const { supabase } = useSupabase()

const { id, isSignedIn } = useAuthUser()
const isLoading = ref(true)
const deckData = ref<Deck[]>([])
const isLoadingYourDecks = ref(true)
const yourDeckData = ref<Deck[]>([])

const getYourDeckData = async () => {
  if (isSignedIn.value) {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('creator', id.value)
      .limit(4)
      .returns<Deck[]>()

    if (error) {
      throwError(error)
    } else {
      yourDeckData.value = data
      isLoadingYourDecks.value = false
    }
  }
}

const getPublicDeckData = async () => {
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .order('created_at', { ascending: false })
    .eq('is_complete', true)
    .eq('is_private', false)
    .limit(6)
    .returns<Deck[]>()

  if (error) {
    throwError(error)
  } else {
    deckData.value = data
    isLoading.value = false
  }
}
onMounted(async () => await Promise.allSettled([getYourDeckData(), getPublicDeckData()]))
watch(isSignedIn, (newVal) => {
  if (newVal) {
    getYourDeckData()
  }
})
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
  border-radius: (--p-card-border-radius);
}
</style>
