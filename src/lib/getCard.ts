import plants from '@/assets/plants.json'
import zombies from '@/assets/zombies.json'
import superPowers from '@/assets/superpowers.json'
import type { Card } from './types'

export default function getCard(name: string) {
  return [...plants, ...zombies, ...superPowers].find((e) => e.name === name) as Card
}
