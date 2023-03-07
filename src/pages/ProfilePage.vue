<script lang="ts">
export default {
  name: "ProfilePage",
};
</script>

<template>
  {{ user }}
  <span v-if="!isLoading">
    Hi {{ data.username }} image: {{ data.profile_image }}

    <RouterLink :to="{ name: 'CreateDeck' }">Make a deck</RouterLink>
  </span>
</template>

<script lang="ts" setup>
//TODO: show personal decks
import { ref, onMounted } from "vue";
import useAuthUser from "@/composables/UseAuthUser";
import useSupabase from "@/composables/UseSupabase";
const { user } = useAuthUser();
const { supabase } = useSupabase();

const data = ref({
  username: "",
  profile_image: "",
});
const isLoading = ref(true);
onMounted(async () => {
  const { data: query, error } = await supabase
    .from("profiles")
    .select("username, profile_image")
    .single();
  if (error) {
    throw error;
  }
  data.value = query;
  isLoading.value = false;
});
</script>

<style scoped></style>
