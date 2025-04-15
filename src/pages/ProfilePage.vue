<template>
  <main>
    <Dialog
      :draggable="false"
      :modal="true"
      v-model:visible="isChangeHeroModalOpen"
      style="max-width: 500px; width: 100%; margin: var(--block-space)"
      header="Change Profile Image"
    >
      <InputGroup>
        <HeroSelect v-model="selectedHero" aria-label="Hero" />
        <Button label="Update" @click="updateHeroImage" :loading="isUpdatingProfileImage" />
      </InputGroup>
    </Dialog>
    <Dialog
      :draggable="false"
      :modal="true"
      v-model:visible="isChangeUsernameModalOpen"
      style="max-width: 500px; width: 100%; margin: var(--block-space)"
      header="Change Username"
    >
      <InputGroup>
        <InputText
          v-model="selectedUsername"
          aria-label="Hero"
          @keyup.enter="updateUsername"
          autofocus
        />
        <Button label="Update" @click="updateUsername" :loading="isUpdatingUsername" />
      </InputGroup>
    </Dialog>
    <header>
      <div class="profile-container">
        <Avatar
          size="xlarge"
          shape="circle"
          class="profile-image"
          :image="getHero(user.profile_image).image"
          :class="{ 'is-user': user.id === id }"
          @click="user.id === id && changeHero()"
        >
        </Avatar>
        <div>
          <h1
            :class="{ 'is-clickable': user.id === id }"
            @click="user.id === id && changeUsername()"
          >
            {{ user.username }}
          </h1>
          <p class="joined">
            Joined
            {{ new Date(user.created_at).toDateString().replace(/^\S+\s|\d+\s/g, '') }}
          </p>
        </div>
      </div>
    </header>

    <div v-if="user.id === id" class="user-buttons">
      <RouterLink :to="{ name: 'CreateDeck' }" style="text-decoration: none">
        <Button label="New Deck">
          <template #icon="iconClass">
            <Plus :class="iconClass.class" />
          </template>
        </Button>
      </RouterLink>
      <Button label="Change Username" severity="secondary" @click="changeUsername">
        <template #icon="iconClass">
          <UserPen :class="iconClass.class" />
        </template>
      </Button>
      <Button label="Change Profile Image" severity="secondary" @click="changeHero">
        <template #icon="iconClass">
          <CircleUser :class="iconClass.class" />
        </template>
      </Button>
    </div>

    <h2>Decks</h2>
    <div class="deck-container" v-if="isLoading">
      <Skeleton v-for="index in 6" :key="index" class="deck-skeleton" height="175px"></Skeleton>
    </div>
    <Message v-else-if="sortedDecks.length === 0" :severity="'warn'" :closable="false">
      No Decks
    </Message>
    <div class="deck-container" v-else>
      <DeckCard v-for="deck in sortedDecks" :key="deck.id" :deck="deck" showVisibility />
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { CircleUser, Plus, UserPen } from 'lucide-vue-next'
import { Avatar, Button, Dialog, InputGroup, InputText, Message, Skeleton } from 'primevue'
import DeckCard from '@/components/DeckCard.vue'
import HeroSelect from '@/components/HeroSelect.vue'
import TheFooter from '@/components/TheFooter.vue'
import getHero from '@/lib/getHero'
import useSupabase from '@/composables/UseSupabase'
import useAuthUser from '@/composables/UseAuthUser'
import throwError from '@/lib/throwError'
import { useUserStore } from '@/store/user'
import type { Deck } from '@/lib/types'

const user = useUserStore()
const { supabase } = useSupabase()
const { id } = useAuthUser()

const isLoading = ref(true)
const deckData = ref<Deck[]>([])

const loadDecks = async () => {
  isLoading.value = true
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('creator', user.id)
    .overrideTypes<Deck[]>()

  if (error) {
    throwError(error)
    throw new Error()
  } else {
    deckData.value = data
    isLoading.value = false
  }
}

onMounted(loadDecks)

const sortedDecks = computed(() =>
  [...deckData.value].sort(
    (a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime(),
  ),
)

const isChangeHeroModalOpen = ref(false)
const selectedHero = ref(user.profile_image)
const isUpdatingProfileImage = ref(false)
const changeHero = () => {
  isChangeHeroModalOpen.value = true
}

const updateHeroImage = async () => {
  if (selectedHero.value === user.profile_image) {
    isChangeHeroModalOpen.value = false
    return
  }

  isUpdatingProfileImage.value = true
  const error = await user.update({
    profile_image: selectedHero.value,
  })
  isUpdatingProfileImage.value = false
  if (!error) {
    isChangeHeroModalOpen.value = false
  }
}

const isChangeUsernameModalOpen = ref(false)
const selectedUsername = ref(user.username)
const isUpdatingUsername = ref(false)
const changeUsername = () => {
  isChangeUsernameModalOpen.value = true
}

const updateUsername = async () => {
  if (selectedUsername.value === user.username) {
    isChangeHeroModalOpen.value = false
    return
  }

  isUpdatingUsername.value = true
  const error = await user.update({
    username: selectedUsername.value,
  })
  isUpdatingUsername.value = false
  if (!error) {
    isChangeUsernameModalOpen.value = false
  }
}

onBeforeRouteUpdate(async (to) => {
  const user = useUserStore()
  const isLoadError = await user.loadFromUsername(to.params.username.toString())
  if (isLoadError) {
    return { name: '404' }
  }
  document.title = `${to.params.username} • Sprout`
  loadDecks()
})
</script>

<style scoped>
main {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.profile-container {
  display: flex;
  align-items: center;
  margin-bottom: var(--block-space);
}
.profile-image {
  margin-right: var(--inline-space);
  flex-shrink: 0;
  background-color: var(--p-surface-950);
  transition-duration: 0.25s;
}
.is-user,
.is-clickable {
  cursor: pointer;
}
.is-user:hover,
.is-clickable:hover {
  opacity: 0.8;
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
.p-message {
  margin: 0 auto;
  width: fit-content;
}

.user-buttons {
  display: flex;
  gap: var(--inline-space);
  align-items: center;
  flex-wrap: wrap;
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
