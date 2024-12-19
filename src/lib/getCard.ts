import plants from '@/content/plants.json'
import zombies from '@/content/zombies.json'
import superPowers from '@/content/superpowers.json'
import type { Card } from './types'

export default function getCard(name: string) {
  return [...plants, ...zombies, ...superPowers].find((e) => e.name === name) as Card
}
