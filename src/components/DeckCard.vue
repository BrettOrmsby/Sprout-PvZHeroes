<script lang="ts">
export default {
  name: "DeckCard",
  components: { HeroImage },
};
</script>

<template>
  <RouterLink
    :to="{ name: 'ViewDeck', params: { id: deck.id } }"
    class="deck-card"
  >
    <div class="title-container">
      <Avatar size="large" shape="circle" class="hero">
        <HeroImage :name="deck.hero" />
      </Avatar>
      <h2>{{ deck.name }}</h2>
    </div>
    <p class="description">{{ deck.description }}</p>
    <p class="last-updated">Last updated {{ timeSinceUpdate }}</p>
    <div style="position: relative">
      <i
        class="pi pi-lock private-icon"
        v-if="isUsersDeck && deck.is_private"
      ></i>
      <i
        class="pi pi-globe private-icon"
        v-if="isUsersDeck && !deck.is_private"
      ></i>
    </div>
  </RouterLink>
</template>

<script lang="ts" setup>
import useAuthUser from "@/composables/UseAuthUser";
import { computed, ref, onUnmounted } from "vue";
import HeroImage from "./deck/HeroImage.vue";
import Avatar from "primevue/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const props = defineProps<{
  deck: {
    id: string;
    creator: string;
    name: string;
    is_private: boolean;
    is_complete: boolean;
    hero: string;
    list: Record<string, number>;
    created_at: string;
    last_updated: string;
    description: string;
  };
}>();

const { id } = useAuthUser();

const isUsersDeck = computed(() => id.value === props.deck.creator);

const refreshDateKey = ref(0);
const timeSinceUpdate = computed(() => {
  refreshDateKey.value;
  let lastUpdated = dayjs(props.deck.last_updated).fromNow();
  if (lastUpdated.startsWith("in")) {
    return "a few seconds ago";
  }
  return dayjs(props.deck.last_updated).fromNow();
});

const interval = setInterval(() => ++refreshDateKey.value, 60000);

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.deck-card {
  background-color: var(--surface-card);
  padding: var(--content-padding);
  border-radius: var(--border-radius);
  max-width: 400px;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  color: var(--text-color);
  overflow: hidden;
}
.deck-card:hover {
  border: 2px solid var(--primary-color);
}

.title-container {
  display: flex;
  align-items: center;
}
h2 {
  margin: 0;
}
.hero {
  margin-right: var(--inline-spacing);
  flex-shrink: 0;
}

.description {
  color: var(--text-color-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.last-updated {
  color: var(--text-color-secondary);
  margin-bottom: 0;
  font-size: 0.8em;
}
.private-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: -16px;
  margin-right: -16px;
}
</style>
