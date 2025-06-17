<template>
  <main>
    <ChangeHeroModal v-model:open="isChangeHeroModalOpen" />
    <ChangeUsernameModal v-model:open="isChangeUsernameModalOpen" />
    <PreferencesModal v-model:open="isPreferencesModalOpen" />
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
            {{ joined }}
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
      <Button label="Preferences" severity="secondary" @click="openPreferences">
        <template #icon="iconClass">
          <Settings :class="iconClass.class" />
        </template>
      </Button>
    </div>

    <h2>Decks</h2>
    <div class="deck-container" v-if="isLoading">
      <Skeleton v-for="index in 6" :key="index" class="deck-skeleton" height="175px"></Skeleton>
    </div>
    <Message v-else-if="isError" severity="error"> Failed to load decks. </Message>
    <Message v-else-if="decks.length === 0" :severity="'warn'" :closable="false">
      No Decks
    </Message>
    <div class="deck-container" v-else>
      <DeckCard v-for="deck in decks" :key="deck.id" :deck="deck" showVisibility />
    </div>
  </main>
  <TheFooter />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { CircleUser, Plus, Settings, UserPen } from 'lucide-vue-next'
import { Avatar, Button, Message, Skeleton } from 'primevue'
import DeckCard from '@/components/DeckCard.vue'
import TheFooter from '@/components/TheFooter.vue'
import ChangeHeroModal from '@/components/profile/ChangeHeroModal.vue'
import ChangeUsernameModal from '@/components/profile/ChangeUsernameModal.vue'
import PreferencesModal from '@/components/profile/PreferencesModal.vue'
import getHero from '@/lib/getHero'
import useAuthUser from '@/composables/UseAuthUser'
import { useUserStore } from '@/store/user'
import { useUserDecks } from '@/composables/useUserDecks'

const user = useUserStore()
const { id } = useAuthUser()

const userId = computed(() => user.id)
const { decks, isLoading, isError } = useUserDecks(userId, 'last_updated')

const joined = computed(() =>
  new Date(user.created_at).toLocaleDateString('en', { month: 'long', year: 'numeric' }),
)

const isChangeHeroModalOpen = ref(false)
const changeHero = () => {
  isChangeHeroModalOpen.value = true
}

const isChangeUsernameModalOpen = ref(false)
const changeUsername = () => {
  isChangeUsernameModalOpen.value = true
}
const isPreferencesModalOpen = ref(false)
const openPreferences = () => {
  isPreferencesModalOpen.value = true
}

onBeforeRouteUpdate(async (to) => {
  const user = useUserStore()
  const isLoadError = await user.loadFromUsername(to.params.username.toString())
  if (isLoadError) {
    const router = useRouter()
    router.replace({ name: '404' })
  }
  document.title = `${to.params.username} • Sprout`
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
  border-radius: var(--p-card-border-radius);
}
</style>
