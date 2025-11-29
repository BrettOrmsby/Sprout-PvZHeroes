import plants from '../src/content/plants.json' with { type: 'json' }
import zombies from '../src/content/zombies.json' with { type: 'json' }
import heroData from '../src/content/heroes.json' with { type: 'json' }

import type { Card, Hero } from '../src/lib/types.ts'

// These function are modified copies from the main website
export const cardMap = new Map<string, Card>()

for (const card of [...plants, ...zombies]) {
  cardMap.set(card.name.toLowerCase(), card as Card)
}

export function getCard(name: string): Card {
  return cardMap.get(name.toLowerCase())!
}

export function getHero(name: string) {
  return heroData.find((e) => e.name === name) as Hero
}
export function isPlant(className: string) {
  return ['Guardian', 'Kabloom', 'Mega-Grow', 'Smarty', 'Solar'].includes(className)
}
