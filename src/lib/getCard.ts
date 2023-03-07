import plants from "@/assets/plants.json";
import zombies from "@/assets/plants.json";
import type { Card } from "./types";

export default function getCard(name: string) {
  return [...plants, ...zombies].find((e) => e.name === name) as Card;
}
