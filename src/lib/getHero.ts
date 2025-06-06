import heroData from '@/content/heroes.json'
import type { Hero } from './types'

export default function getHero(name: string) {
  return heroData.find((e) => e.name === name) as Hero
}
