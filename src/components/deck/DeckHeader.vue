<template>
  <SettingsModal />
  <header>
    <div
      class="hero-container"
      :style="{
        background: `linear-gradient(
      to right,
      ${colours[hero.class[0]]} 50%,
      ${colours[hero.class[1]]} 50%
    )`,
      }"
    >
      <Avatar
        size="xlarge"
        shape="circle"
        :image="hero.image"
        @click="openModal"
        class="clickable"
        :pt="{ image: { alt: hero.name } }"
      />
      <div class="class-container">
        <img
          v-for="className in hero.class"
          :key="className"
          class="class"
          :src="'/images/classes/' + className.toLowerCase() + '.png'"
          :alt="className"
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
      <h1 @click="deck.isUsersDeck && openSettings()" :class="{ clickable: deck.isUsersDeck }">
        {{ deck.name }}
      </h1>
      <p @click="deck.isUsersDeck && openSettings()" :class="{ clickable: deck.isUsersDeck }">
        {{ deck.description }}
      </p>
      <div class="extras-container">
        <div class="hearts">
          <Button
            class="heart-button"
            :class="{ fill: hearts.hearts.includes(deck.id) }"
            variant="text"
            rounded
            :aria-label="heartToolTip"
            :disabled="deck.isUsersDeck || !isSignedIn"
            @click="hearts.updateLike(deck.id, deck.creator)"
            v-tooltip.bottom="{
              value: heartToolTip,
              showDelay: 1000,
              hideDelay: 300,
            }"
          >
            <template #icon="iconClass">
              <Heart :class="iconClass.class" />
            </template> </Button
          >{{ deck.hearts }}
        </div>
        <Tag
          v-if="deck.is_private"
          value="Private"
          severity="secondary"
          @click="deck.isUsersDeck && openSettings()"
          :class="{ clickable: deck.isUsersDeck }"
        />
        <p class="last-updated">Last updated {{ timeSinceUpdate }}</p>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Avatar, Button, Tag } from 'primevue'
import { Heart } from 'lucide-vue-next'
import SettingsModal from '@/components/deck/SettingsModal.vue'
import getHero from '@/lib/getHero'
import useAuthUser from '@/composables/UseAuthUser'
import { useUserStore } from '@/store/user'
import { useHeartStore } from '@/store/hearts'
import { useDeckStore } from '@/store/deck'
import { useStatesStore } from '@/store/states'

const user = useUserStore()
const deck = useDeckStore()
const hearts = useHeartStore()
const states = useStatesStore()
const { isSignedIn } = useAuthUser()

dayjs.extend(relativeTime)
const refreshDateKey = ref(0)

const hero = computed(() => getHero(deck.hero))

const timeSinceUpdate = computed(() => {
  // eslint-disable-next-line
  refreshDateKey.value
  const lastUpdated = dayjs(deck.last_updated).fromNow()
  return lastUpdated.startsWith('in') ? 'a few seconds ago' : lastUpdated
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
  states.heroModal.hero = deck.hero
  states.heroModal.show = true
}

const openSettings = () => {
  states.editModal = true
}

const heartToolTip = computed(() => {
  if (!isSignedIn.value || deck.isUsersDeck) {
    return 'Likes'
  }
  if (hearts.hearts.includes(deck.id)) {
    return 'Unlike'
  }
  return 'Like'
})
</script>

<style scoped>
header {
  margin-top: 2.8em;
  border-bottom: 1px solid var(--p-content-border-color);
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  margin-bottom: var(--block-space);
  background-color: light-dark(var(--p-surface-50), var(--p-surface-950));
}

.hero-container {
  flex-direction: column;
  justify-content: center;
  display: flex;
  align-items: center;
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

.extras-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--block-space);
}

.hearts {
  display: flex;
  justify-content: center;
  align-items: center;
  /* Keep disabled buttons the same colour */
  --p-disabled-opacity: 1;
}
.heart-button:not(:disabled):hover {
  background-color: light-dark(var(--p-primary-100), var(--p-primary-950));
}

:deep(.fill svg) {
  fill: currentColor;
}

.last-updated {
  color: var(--p-text-muted-color);
  margin: 0;
}

.clickable {
  cursor: pointer;
}
</style>
