<script lang="ts">
export default {
  name: "EditModal",
};
</script>

<template>
  <Dialog :modal="true" v-model:visible="states.editModal">
    <template #header>
      <h2>Editing {{ deck.name }}</h2>
    </template>

    <form @submit.prevent="updateDeck()">
      <div class="block">
        <label for="name">Name</label>
        <InputText
          id="name"
          type="text"
          v-model="newInfo.name"
          :class="{ 'p-invalid': showNameError }"
          maxlength="50"
        />
        <small v-if="showNameError" id="invalidName" class="p-error"
          >Must include a name.</small
        >
      </div>

      <div class="block">
        <label for="description">Description</label>
        <Textarea
          id="description"
          :autoResize="true"
          v-model="newInfo.description"
          maxlength="150"
        />
      </div>

      <div class="block">
        <ToggleButton
          v-model="newInfo.is_private"
          onLabel="Private"
          offLabel="Public"
          onIcon="pi pi-lock"
          offIcon="pi pi-globe"
        />
      </div>

      <Button :loading="isLoading" label="Submit" type="submit" />
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import states from "@/store/states";
import deck from "@/store/deck";
import { ref } from "vue";
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/thowError";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import ToggleButton from "primevue/togglebutton";

const { supabase } = useSupabase();

const newInfo = ref({
  name: deck.name,
  description: deck.description,
  is_private: deck.is_private,
});

const showNameError = ref(false);

const isLoading = ref(false);

const updateDeck = async () => {
  if (newInfo.value.name.trim() === "") {
    showNameError.value = true;
    return;
  } else {
    showNameError.value = false;
  }

  isLoading.value = true;
  const { data, error } = await supabase
    .from("decks")
    .update(newInfo.value)
    .eq("id", deck.id)
    .select();
  if (error) {
    isLoading.value = false;
    throwError(error);
    return;
  }

  Object.assign(deck, data[0]);

  isLoading.value = false;
  states.editModal = false;
};
</script>

<style scoped>
h2 {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30ch;
  white-space: nowrap;
  margin: 0;
}
small {
  margin-top: var(--inline-spacing);
  display: block;
}
label {
  margin-bottom: var(--inline-spacing);
  display: block;
}
.block {
  margin-bottom: var(--inline-block-spacing);
}

input,
textarea {
  width: 100%;
}
</style>
