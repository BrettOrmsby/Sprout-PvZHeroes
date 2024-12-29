<template>
  <SettingsModal />
  <header>
    <div class="hero-container">
      <Avatar
        size="xlarge"
        shape="circle"
        :image="hero.image"
        @click="openModal"
        class="clickable"
      />
      <div class="class-container">
        <img
          class="class"
          :src="'/images/classes/' + hero.class[0].toLowerCase() + '.png'"
          :alt="hero.class[0]"
        />
        <img
          class="class"
          :src="'/images/classes/' + hero.class[1].toLowerCase() + '.png'"
          :alt="hero.class[1]"
        />
      </div>
    </div>
    <div class="content-container">
      <div class="user-container">
        <Avatar
          size="normal"
          shape="circle"
          class="profile-image"
          :image="getHero(user.profile_image).image"
        />
        <RouterLink
          :to="{ name: 'Profile', params: { username: user.username } }"
          class="username"
          >{{ user.username }}</RouterLink
        >
      </div>
      <h1 @click="() => isUsersDeck && openSettings()" :class="{ clickable: isUsersDeck }">
        {{ deck.name }}
      </h1>
      <p @click="() => isUsersDeck && openSettings()" :class="{ clickable: isUsersDeck }">
        {{ deck.description }}
      </p>
      <p class="last-updated">Last updated {{ timeSinceUpdate }}</p>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useDeckStore } from '@/store/deck'
import states from '@/store/states'
import getHero from '@/lib/getHero'
import { ref, computed, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Avatar from 'primevue/avatar'
import SettingsModal from '@/components/deck/SettingsModal.vue'
import user from '@/store/user'
import useAuthUser from '@/composables/UseAuthUser'

const deck = useDeckStore()

dayjs.extend(relativeTime)
const refreshDateKey = ref(0)

const { id } = useAuthUser()
const hero = computed(() => getHero(deck.hero))
const isUsersDeck = computed(() => id.value === deck.creator)

const timeSinceUpdate = computed(() => {
  // eslint-disable-next-line
  refreshDateKey.value
  const lastUpdated = dayjs(deck.last_updated).fromNow()
  if (lastUpdated.startsWith('in')) {
    return 'a few seconds ago'
  }
  return dayjs(deck.last_updated).fromNow()
})

const interval = setInterval(() => ++refreshDateKey.value, 60000)
onUnmounted(() => clearInterval(interval))

const colours: Record<string, string> = {
  Guardian: '#492F1C',
  Kabloom: '#A03732',
  'Mega-Grow': '#64A65B',
  Smarty: '#A3A2A4',
  Solar: '#D6D848',

  Beastly: '#4771A6',
  Brainy: '#91398D',
  Crazy: '#6331B9',
  Hearty: '#9B762C',
  Sneaky: '#3A3939',
}

const openModal = () => {
  states.heroModel.hero = deck.hero
  states.heroModel.show = true
}

const openSettings = () => {
  states.editModal = true
}
</script>

<style scoped>
header {
  margin-top: 2.8em;
  border-bottom: 1px solid var(--p-content-border-color);
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  margin-bottom: var(--block-space);
  background-color: var(--p-surface-950);
}

.hero-container {
  flex-direction: column;
  justify-content: center;
  display: flex;
  align-items: center;
  background: linear-gradient(
    to right,
    v-bind('colours[hero.class[0]]') 50%,
    v-bind('colours[hero.class[1]]') 50%
  );
  padding: var(--inline-space);
  gap: var(--inline-space);
}
.class-container {
  display: flex;
  gap: var(--block-space);
  justify-content: center;
  align-items: center;
}
.class-container img {
  width: 1.5em;
}

.content-container {
  padding: var(--block-space);
}

h1 {
  font-size: 3em;
  margin: var(--block-space) 0;
}
.username {
  text-decoration: none;
  color: var(--p-primary-400);
  font-size: 1.5em;
  margin-left: var(--inline-space);
  transition: 0.25s;
}
.username:hover {
  color: var(--p-primary-500);
}
.profile-image {
  flex-shrink: 0;
}

.user-container {
  display: flex;
  align-items: center;
}

.last-updated {
  color: var(--p-text-muted-color);
  margin-bottom: 0;
}

.clickable {
  cursor: pointer;
}
</style>
