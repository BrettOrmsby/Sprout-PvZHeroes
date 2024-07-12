<template>
  <CardModal />
  <main>
    <h1>Comparing {{ firstDeck!.name }}</h1>
    <CompareInput :id="id" v-model="toInput" />

    <template v-for="(value, key) in comparison" :key="key">
      <h2>
        {{
          key === "both"
            ? "Shared in Both Decks"
            : `Unique to ${getDeck(key as string).name}`
        }}
        ({{ Object.values(value).reduce((prev, curr) => prev + curr, 0) }})
      </h2>
      <Message
        v-if="Object.values(value).length === 0"
        :severity="'warn'"
        :closable="false"
        >No Unique Cards</Message
      >
      <div v-else class="card-group">
        <ComparePVZCard
          v-for="card in sortList(value)"
          :key="card.name"
          :card="card"
          :amount="value[card.name]"
        />
      </div>
    </template>
  </main>
</template>

<script lang="ts" setup>
import CompareInput from "@/components/CompareInput.vue";
import Message from "primevue/message";
import ComparePVZCard from "@/components/ComparePVZCard.vue";
import CardModal from "@/components/CardModal.vue";
import { useRouter } from "vue-router";
import useSupabase from "@/composables/UseSupabase";
import useAuthUser from "@/composables/UseAuthUser";
import type { Deck } from "@/lib/types";
import { ref, computed } from "vue";
import getCard from "@/lib/getCard";

const props = defineProps<{ id: string; to: string }>();

const { supabase } = useSupabase();
const { id: userId } = useAuthUser();

const router = useRouter();

const { data: firstDeck } = await supabase
  .from("decks")
  .select()
  .eq("id", props.id)
  .returns<Deck[]>()
  .single();

if (!firstDeck) {
  router.push({ name: "404" });
}

const { data: secondDeck } = await supabase
  .from("decks")
  .select()
  .eq("id", props.to)
  .returns<Deck[]>()
  .single();

if (!secondDeck) {
  router.push({ name: "404" });
}

const getDeck = (id: string) =>
  firstDeck!.id === id ? firstDeck! : secondDeck!;
const sortList = (list: Record<string, number>) =>
  Object.keys(list)
    .map((e) => getCard(e))
    .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));

const comparison = computed(() => {
  const comparison = {
    [firstDeck!.id]: {} as Record<string, number>,
    [secondDeck!.id]: {},
    both: {} as Record<string, number>,
  };

  for (const [name, amount] of Object.entries(firstDeck!.list)) {
    if (name in secondDeck!.list) {
      if (secondDeck!.list[name] < amount) {
        comparison[firstDeck!.id][name] = amount - secondDeck!.list[name];
        comparison.both[name] = secondDeck!.list[name];
      } else if (secondDeck!.list[name] === amount) {
        comparison.both[name] = secondDeck!.list[name];
      }
    } else {
      comparison[firstDeck!.id][name] = amount;
    }
  }

  for (const [name, amount] of Object.entries(secondDeck!.list)) {
    if (name in firstDeck!.list) {
      if (firstDeck!.list[name] < amount) {
        comparison[secondDeck!.id][name] = amount - firstDeck!.list[name];
        comparison.both[name] = firstDeck!.list[name];
      }
    } else {
      comparison[secondDeck!.id][name] = amount;
    }
  }

  return comparison;
});

// TODO: this real link
const toInput = ref("http://localhost:5173/deck/" + secondDeck!.id);
</script>

<style scoped>
h1,
h2 {
  text-align: center;
}

.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--inline-space);
  justify-content: center;
  align-items: stretch;
}
</style>
