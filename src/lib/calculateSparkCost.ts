import type { Card } from "./types";

const regularSparkCosts: Record<string, number> = {
  common: 25,
  uncommon: 50,
  rare: 250,
  "super-rare": 1000,
  legendary: 4000,
  event: 1000,
};

// TODO: this may not be factually correct
const specialSparkCosts: Record<string, number> = {
  "Jack O' Lantern": 2000,
  "Trick-or-Treater": 2000,
  Mayflower: 2000,
  "Turkey Rider": 2000,
  "Red Stinger": 2000,
  "Jolly Holly": 2000,
  "Hot Date": 2000,
  "Leprechaun Imp": 2000,
  "Hippity Hop Gargantuar": 2000,
  "Gargantuar-Throwing Imp": 2000,
  "King of the Grill": 2000,
  "Kitchen Sink Zombie": 2000,
  "Zombology Teacher": 2000,
  "Witch Hazel": 2000,
  Transfiguration: 2000,
  "Exploding Fruitcake": 2000,
};

export default function calculateSparkCost(card: Card): number {
  if (card.name in specialSparkCosts) {
    return specialSparkCosts[card.name];
  }
  return regularSparkCosts[card.rarity];
}
