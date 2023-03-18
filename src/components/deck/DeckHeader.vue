<script lang="ts">
export default {
  name: "DeckHeader",
};
</script>

<template>
  <EditModal />
  <header>
    <div class="user-container">
      <Avatar size="large" shape="circle" class="profile-image">
        <HeroImage :name="profileImage" />
      </Avatar>
      <RouterLink
        :to="{ name: 'Profile', params: { username } }"
        class="username"
        >{{ username }}</RouterLink
      >
    </div>
    <h1>{{ deck.name }}</h1>
    <p>{{ deck.description }}</p>
    <p>Last updated {{ timeSinceUpdate }}</p>
    <Button
      v-if="isUsersDeck"
      icon="pi pi-pencil"
      @click="states.editModal = true"
    />
  </header>
</template>

<script lang="ts" setup>
import deck from "@/store/deck";
import states from "@/store/states";
import useAuthUser from "@/composables/UseAuthUser";
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/thowError";
import { ref, computed, onUnmounted } from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import HeroImage from "@/components/deck/HeroImage.vue";
import EditModal from "@/components/deck/EditModal.vue";

dayjs.extend(relativeTime);

const { id } = useAuthUser();
const { supabase } = useSupabase();
const username = ref("");
const profileImage = ref("");
const isUsersDeck = ref(false);
const refreshDateKey = ref(0);

const { data, error } = await supabase
  .from("profiles")
  .select("username, profile_image")
  .eq("id", deck.creator)
  .single();

if (error) {
  throwError(error);
  username.value = "????";
  profileImage.value = "Green Shadow";
} else {
  username.value = data.username;
  profileImage.value = data.profile_image;
  isUsersDeck.value = deck.creator === id.value;
}

const timeSinceUpdate = computed(() => {
  refreshDateKey.value;
  let lastUpdated = dayjs(deck.last_updated).fromNow();
  if (lastUpdated.startsWith("in")) {
    return "a few seconds ago";
  }
  return dayjs(deck.last_updated).fromNow();
});

const interval = setInterval(() => ++refreshDateKey.value, 60000);
onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
header {
  background-color: var(--surface-card);
  padding: var(--content-padding);
}

h1 {
  font-size: 3em;
  margin: var(--inline-block-spacing) 0;
}
.username {
  text-decoration: none;
  color: var(--primary);
  font-size: 1.5em;
  margin-left: var(--inline-spacing);
}

.profile-image {
  flex-shrink: 0;
}
.username:hover {
  color: var(--primary-hover);
}
.user-container {
  display: flex;
  align-items: center;
}
</style>
