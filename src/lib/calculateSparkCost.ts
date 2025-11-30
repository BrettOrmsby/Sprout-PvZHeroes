import type { Card } from './types'

const regularSparkCosts: Record<string, number> = {
  common: 25,
  uncommon: 50,
  rare: 250,
  'super-rare': 1000,
  legendary: 4000,
  event: 1000,
}

const specialSparkCosts: Record<string, number> = {
  'Red Stinger': 2000,
  'Hot Date': 2000,
  'Leprechaun Imp': 2000,
  'Hippity Hop Gargantuar': 2000,
  'Gargantuar-Throwing Imp': 2000,
  'King of the Grill': 2000,
  'Kitchen Sink Zombie': 2000,
  'Zombology Teacher': 2000,
  'Witch Hazel': 2000,
  Transfiguration: 2000,
  'Exploding Fruitcake': 2000,
}

export default function calculateSparkCost(card: Card): number {
  if (card.name in specialSparkCosts) {
    return specialSparkCosts[card.name]
  }
  return regularSparkCosts[card.rarity]
}

const regularSparkScraps: Record<string, number> = {
  common: 0,
  uncommon: 15,
  rare: 50,
  'super-rare': 250,
  legendary: 1000,
  event: 250,
}

const specialSparkScraps: Record<string, number> = {
  'Red Stinger': 500,
  'Hot Date': 500,
  'Leprechaun Imp': 500,
  'Hippity Hop Gargantuar': 500,
  'Gargantuar-Throwing Imp': 500,
  'King of the Grill': 500,
  'Kitchen Sink Zombie': 500,
  'Zombology Teacher': 500,
  'Witch Hazel': 500,
  Transfiguration: 500,
  'Exploding Fruitcake': 500,
  'Planet of the Grapes': 50,
  'Barrel of Barrels': 50,
  'Shelf Mushroom': 250,
  'Sergeant Strongberry': 1000,
  'Solar Winds': 1000,
  'Disco-Naut': 1000,
  Fireweed: 1000,
  Strawberrian: 1000,
  'Briar Rose': 4000,
  Valkyrie: 4000,
}

export function calculateSparkScraps(card: Card): number {
  if (card.name in specialSparkScraps) {
    return specialSparkScraps[card.name]
  }
  return regularSparkScraps[card.rarity]
}
