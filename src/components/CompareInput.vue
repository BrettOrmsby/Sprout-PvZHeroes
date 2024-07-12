<template>
  <div>
    <form @submit.prevent="compareDecks()">
      <label for="url">Enter the deck URL of the comparison.</label>
      <InputGroup>
        <InputText
          id="url"
          type="text"
          placeholder="Deck URL"
          v-model="to"
          :class="{ 'p-invalid': isCompareDeckError }"
        />
        <Button :loading="isCompareDeckLoading" label="Compare" type="submit" />
      </InputGroup>
      <small v-if="isCompareDeckError" class="error">{{
        compareDeckErrorMessage
      }}</small>
    </form>
  </div>
</template>

<script lang="ts" setup>
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import { ref } from "vue";
import { useRouter } from "vue-router";
import useSupabase from "@/composables/UseSupabase";

const props = defineProps<{ id: string }>();
const to = defineModel<string>({ required: true });

const { supabase } = useSupabase();
const router = useRouter();

const compareDeckErrorMessage = ref("");
const isCompareDeckError = ref(false);
const isCompareDeckLoading = ref(false);
const compareDecks = async () => {
  const toId = to.value.split("/")[to.value.split("/").length - 1];

  if (toId === props.id) {
    isCompareDeckError.value = true;
    compareDeckErrorMessage.value = "Decks must be different.";
    return;
  }

  isCompareDeckLoading.value = true;
  try {
    const { error } = await supabase
      .from("decks")
      .select("id")
      .eq("id", toId)
      .single();

    if (error) {
      throw error;
    }
    isCompareDeckError.value = false;
    router.push({ name: "Compare", params: { id: props.id, to: toId } });
  } catch (e) {
    isCompareDeckError.value = true;
    compareDeckErrorMessage.value = "Deck does not exist.";
  } finally {
    isCompareDeckLoading.value = false;
  }
};
</script>

<style scoped>
.error {
  margin-top: var(--inline-space);
  color: var(--p-red-300);
  display: block;
}

label {
  display: block;
  margin-bottom: var(--inline-space);
}
</style>
