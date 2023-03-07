<script lang="ts">
export default {
  name: "CreateDeck",
};
</script>

<template>
  <h1>Create a Deck</h1>
  <form @submit.prevent="createDeck()">
    <span>
      <label for="name">Name</label>
      <InputText
        id="name"
        type="text"
        v-model="deckInfo.name"
        class="p-invalid"
      />
    </span>
    <small id="invalidName" class="p-error">Name too long.</small>

    <span id="heroLabel">Hero</span>
    <Listbox
      v-model="deckInfo.hero"
      :options="heroData.plants"
      optionLabel="name"
      aria-labelledby="heroLabel"
    />

    <span>
      <label for="description">Description</label>
      <InputText
        id="description"
        type="text"
        v-model="deckInfo.description"
        class="p-invalid"
      />
    </span>
    <small id="invalidDescription" class="p-error">Description too long.</small>

    <ToggleButton
      v-model="deckInfo.isPrivate"
      onLabel="Private"
      offLabel="Public"
      onIcon="pi pi-lock"
      offIcon="pi pi-globe"
    />

    <Button label="Submit" type="submit" />
  </form>
</template>

<script lang="ts" setup>
import useSupabase from "@/composables/UseSupabase";
import useAuthUser from "@/composables/UseAuthUser";
import { ref } from "vue";
import { useRouter } from "vue-router";
import heroData from "@/assets/heros.json";
import InputText from "primevue/inputtext";
import ToggleButton from "primevue/togglebutton";
import Button from "primevue/button";
import Listbox from "primevue/listbox";

const router = useRouter();
const { supabase } = useSupabase();
const { id } = useAuthUser();
const deckInfo = ref({
  name: "",
  hero: "",
  description: "",
  isPrivate: false,
});
const createDeck = async () => {
  console.log(deckInfo.value.hero);
  const { error, data } = await supabase
    .from("decks")
    .insert({
      creator: id.value,
      name: deckInfo.value.name,
      // it thinks `deckInfo.value.hero` is a string for some reason
      hero: (deckInfo.value.hero as any).name,
      description: deckInfo.value.description,
      is_private: deckInfo.value.isPrivate,
      is_complete: false,
      list: {},
    })
    .select("id")
    .single();
  console.log(data?.id);
  if (error) {
    throw error;
  }
  router.push({ name: "ViewDeck", params: { id: data.id } });
};
</script>

<style scoped>
label {
  display: block;
}
small {
  display: block;
}
</style>
