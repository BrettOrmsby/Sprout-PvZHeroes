<template>
  <CardModal />
  <HeroModal />
  <DeckHeader />
  <DeckHero />
  <main>
    <DeckCards />
    <AddCards v-if="isUsersDeck" />
    <DeckCharts />
  </main>
  <DeckFooter />
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import useSupabase from "@/composables/UseSupabase";
import useAuthUser from "@/composables/UseAuthUser";
import deck from "@/store/deck";
import { computed } from "vue";
import DeckHeader from "@/components/deck/DeckHeader.vue";
import DeckHero from "@/components/deck/DeckHero.vue";
import DeckCards from "@/components/deck/DeckCards.vue";
import AddCards from "@/components/deck/AddCards.vue";
import CardModal from "@/components/deck/CardModal.vue";
import HeroModal from "@/components/deck/HeroModal.vue";
import DeckFooter from "@/components/deck/DeckFooter.vue";
import DeckCharts from "@/components/deck/DeckCharts.vue";

const props = defineProps<{ id: string }>();

const { supabase } = useSupabase();
const { id } = useAuthUser();
const router = useRouter();

const isUsersDeck = computed(() => id.value === deck.creator);

const { data } = await supabase.from("decks").select().eq("id", props.id);

if (data && data[0]) {
  Object.assign(deck, data[0]);
} else {
  router.push({ name: "404" });
}
</script>

<style scoped>
.overflow {
  overflow: scroll;
}
h1,
h2 {
  text-align: center;
}

.deck-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}
</style>
