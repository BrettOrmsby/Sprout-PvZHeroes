<script lang="ts">
export default {
  name: "CardModal",
};
</script>

<template>
  <Dialog
    :modal="true"
    v-model:visible="states.cardModal.show"
    :header="card.name"
  >
    <img :src="card.image" :alt="card.name" />
  </Dialog>
</template>

<script lang="ts" setup>
import states from "@/store/states";
import getCard from "@/lib/getCard";
import { computed } from "vue";
import Dialog from "primevue/dialog";

const card = computed(() => getCard(states.cardModal.card));
</script>

<style scoped></style>
