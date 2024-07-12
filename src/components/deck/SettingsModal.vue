<template>
  <Dialog
    :modal="true"
    v-model:visible="states.editModal"
    @show="updateList"
    style="max-width: 500px; width: 100%; margin: var(--block-space)"
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
      <ToggleSwitch inputId="visibility" v-model="newInfo.is_private" />

      <div class="footer">
        <Button
          label="Cancel"
          @click="() => (states.editModal = false)"
          severity="secondary"
          :disabled="isDeleting || isLoading"
        />
        <Button
          :loading="isDeleting"
          label="Delete"
          @click="deleteDeck"
          severity="danger"
          :aria-expanded="isConfirmVisible"
          :aria-controls="isConfirmVisible ? 'confirm' : null"
          :disabled="isLoading"
        />
        <Button
          :loading="isLoading"
          label="Update"
          type="submit"
          :disabled="isDeleting"
        />
      </div>
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
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import ToggleSwitch from "primevue/toggleswitch";

const reloadList = ref(0);

const { supabase } = useSupabase();

const newInfo = ref({
  name: deck.name,
  description: deck.description,
  is_private: deck.is_private,
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

const router = useRouter();
const isDeleting = ref(false);
const confirm = useConfirm();
const isConfirmVisible = ref(false);
const deleteDeck = () => {
  confirm.require({
    message: `Are you sure you want to delete ${deck.name}? This action cannot be undone.`,
    header: "Confirm Delete",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    async accept() {
      isDeleting.value = true;
      const { error } = await supabase.from("decks").delete().eq("id", deck.id);

      if (error) {
        isDeleting.value = false;
        throwError(error);
        return;
      }

      states.editModal = false;
      router.push({ name: "Home" });
    },
    onShow: () => {
      isConfirmVisible.value = true;
    },
    onHide: () => {
      isConfirmVisible.value = false;
    },
  });
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

.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--inline-space);
}
</style>
