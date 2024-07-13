import { reactive } from "vue";
import type { Deck } from "@/lib/types";

export default reactive<Deck>({
  id: "",
  creator: "",
  name: "",
  is_private: false,
  is_complete: false,
  hero: "",
  list: {},
  created_at: "",
  last_updated: "",
  description: "",
});

export const compareDeck = reactive<Deck>({
  id: "",
  creator: "",
  name: "",
  is_private: false,
  is_complete: false,
  hero: "",
  list: {},
  created_at: "",
  last_updated: "",
  description: "",
});
