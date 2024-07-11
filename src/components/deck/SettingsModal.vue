<template>
  <Dialog
    :modal="true"
    v-model:visible="states.editModal"
    @show="updateList"
    :style="{ width: '100%', 'max-width': '500px' }"
  >
    <template #header>
      <h2>Editing {{ deck.name }}</h2>
    </template>

    <form @submit.prevent="updateDeck()">
      <label for="name">Name</label>
      <InputText
        id="name"
        type="text"
        v-model="newInfo.name"
        :class="{ 'p-invalid': showNameError }"
        maxlength="50"
      />
      <small v-if="showNameError" id="invalidName" class="error"
        >Must include a name.</small
      >

      <label for="description">Description</label>
      <Textarea
        id="description"
        :autoResize="true"
        v-model="newInfo.description"
        maxlength="150"
      />

      <label for="deckList">Deck List (optional)</label>
      <CardListTextArea
        id="deckList"
        v-model:is-error="isCardListError"
        v-model="newInfo.list"
        :hero="deck.hero"
        :key="reloadList"
      />

      <label for="visibility">Make Private</label>
      <ToggleSwitch inputId="visibility" v-model="newInfo.isPrivate" />

      <Button :loading="isLoading" label="Update" type="submit" />
    </form>
  </Dialog>
</template>

<script lang="ts" setup>
import states from "@/store/states";
import deck from "@/store/deck";
import { ref } from "vue";
import useSupabase from "@/composables/UseSupabase";
import throwError from "@/lib/throwError";
import CardListTextArea from "@/components/CardListTextArea.vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import ToggleSwitch from "primevue/toggleswitch";

// TODO: here is where the delete button is
const reloadList = ref(0);

const { supabase } = useSupabase();

const newInfo = ref({
  name: deck.name,
  description: deck.description,
  isPrivate: deck.is_private,
  list: deck.list,
});

const updateList = () => {
  newInfo.value.list = deck.list;
  reloadList.value += 1;
};

const showNameError = ref(false);
const isCardListError = ref(false);
const isLoading = ref(false);

const updateDeck = async () => {
  if (newInfo.value.name.trim() === "") {
    showNameError.value = true;
    return;
  } else {
    showNameError.value = false;
  }
  if (isCardListError.value) {
    return;
  }

  isLoading.value = true;
  const { data, error } = await supabase
    .from("decks")
    .update({
      ...newInfo.value,
      is_complete:
        Object.values(newInfo.value.list).reduce(
          (prev: number, curr: number) => prev + curr,
          0
        ) === 40,
    })
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

label,
#heroLabel {
  display: block;
  margin-bottom: var(--inline-space);
}

.error {
  margin-top: var(--inline-space);
  margin-bottom: var(--block-space);
  color: var(--p-red-300);
  display: block;
}

.p-inputtext,
.p-textarea,
.card-list-textarea {
  width: 100%;
}

:is(.p-inputtext, .p-textarea, .p-toggleswitch, .card-list-textarea):has(
    + :not(small)
  ) {
  margin-bottom: var(--block-space);
}

:deep(.p-button) {
  margin-bottom: var(--block-space);
  display: block;
  width: fit-content;
}
</style>
