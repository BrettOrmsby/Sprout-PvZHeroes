import heros from '@/assets/heros.json'
import type { Hero } from './types'

export default function getHero(name: string) {
  return [...heros.plants, ...heros.zombies].find((e) => e.name === name) as Hero
}
