<template>
  <PVZCard
    :card="card"
    :amount="amount"
    :isValid="true"
    @click.prevent="toggle"
    aria-haspopup="true"
    aria-controls="overlay_menu"
  />
  <Menu
    ref="menu"
    id="overlay_menu"
    :model="items"
    :popup="true"
    style="width: auto"
  >
    <template #item="{ item, props }">
      <a v-bind="props.action">
        <Eye v-if="item.label === 'View'" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>
</template>

<script lang="ts" setup>
import Menu from "primevue/menu";
import { Eye } from "lucide-vue-next";
import { ref, computed } from "vue";
import states from "@/store/states";
import type { Card } from "@/lib/types";
import PVZCard from "@/components/PVZCard.vue";

const props = defineProps<{ card: Card; amount: number }>();

const viewCard = () => {
  states.cardModal.card = props.card.name;
  states.cardModal.show = true;
};

const menu = ref();

const toggle = (event: Event) => {
  menu.value.toggle(event);
};

const items = computed(() => {
  if (true) {
    return [
      {
        label: "View",
        command: viewCard,
      },
    ];
  }
});
</script>

<style scoped></style>
