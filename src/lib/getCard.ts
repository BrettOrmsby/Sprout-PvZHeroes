import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import superPowers from '@/content/superpowers.json'
import type { Card } from './types'

const cardMap = new Map<string, Card>()

for (const card of [...plants, ...zombies, ...superPowers]) {
  cardMap.set(card.name.toLowerCase(), card as Card)
}

export default function getCard(name: string): Card {
  return cardMap.get(name.toLowerCase())!
}

export function getAllCardNamesIterator() {
  return cardMap.keys()
}

export function getAllCardsIterator() {
  return cardMap.values()
}
