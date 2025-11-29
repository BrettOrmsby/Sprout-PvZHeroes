import * as fs from 'fs'
import decks from './decks.json' with { type: 'json' }
import type { Deck } from '../src/lib/types.ts'
import { cardMap, getCard, getHero, isPlant } from './utils.ts'

// Note: I don't handle edge-cases where one hero is not even in the dataset.
export type Stats = {
  completedDecks: number
  sparks: number
  heroDecks: Record<string, number>
  classDecks: Record<string, number>
  plantDecks: number
  zombieDecks: number
  sumRarity: Record<string, number>
  sumCosts: Record<string, number>
  sumPlantTypes: Record<string, number>
  sumZombieTypes: Record<string, number>
  sumCardClasses: Record<string, number>
  cards: Record<string, number>
}

const stats: Stats = {
  completedDecks: 0,
  sparks: 0,
  heroDecks: {},
  classDecks: {},
  plantDecks: 0,
  zombieDecks: 0,
  sumRarity: {},
  sumCosts: {},
  sumPlantTypes: {},
  sumZombieTypes: {},
  sumCardClasses: {},
  cards: {},
}

// Note that we should only call this once, otherwise the results are doubled
export default function createStats(): Stats {
  // Start by counting heroes, sparks, decks, and cards
  countBasics(stats)
  // Then count plant/zombie decks and classes using heroes as reference
  expandOnHeroes(stats)
  // Then count card types, rarities, costs, and class using cards as reference
  expandOnCards(stats)

  fs.writeFile('./data-summary/stats.json', JSON.stringify(stats), (err) => {
    if (err) throw err
    console.log('Stats saved.')
  })

  return stats
}

function countBasics(stats: Stats) {
  // set cards to 0
  for (const card of cardMap.values()) {
    if (card.set == 'token') continue
    if (card.tribes.includes('Superpower')) continue
    stats.cards[card.name] = 0
  }
  for (const deck of decks as Deck[]) {
    if (!deck.is_complete) continue
    // TODO: on future years will need to look to see if data was updated the past year
    stats.completedDecks += 1
    stats.sparks += deck.sparks

    if (!(deck.hero in stats.heroDecks)) {
      stats.heroDecks[deck.hero] = 0
    }
    stats.heroDecks[deck.hero] += 1

    for (const card in deck.list) {
      stats.cards[card] += deck.list[card]
    }
  }
}

function expandOnHeroes(stats: Stats) {
  for (const heroName in stats.heroDecks) {
    const hero = getHero(heroName)
    // Handle classes
    for (const className of hero.class) {
      if (!(className in stats.classDecks)) {
        stats.classDecks[className] = 0
      }
      stats.classDecks[className] += stats.heroDecks[heroName]
    }

    // Handle zombie/plant decks
    if (isPlant(hero.class[0])) {
      stats.plantDecks += stats.heroDecks[heroName]
    } else {
      stats.zombieDecks += stats.heroDecks[heroName]
    }
  }
}

function expandOnCards(stats: Stats) {
  for (const cardName in stats.cards) {
    const card = getCard(cardName)

    // Handle plant/zombie card types (fighter (plant/zombie), trick, environment)
    const isPlant = ['Guardian', 'Kabloom', 'Mega-Grow', 'Smarty', 'Solar'].includes(card.class)
    const typeKey = isPlant ? 'sumPlantTypes' : 'sumZombieTypes'
    if (!(card.type in stats[typeKey])) {
      stats[typeKey][card.type] = 0
    }
    stats[typeKey][card.type] += stats.cards[cardName]

    // Handle card rarities
    if (!(card.rarity in stats.sumRarity)) {
      stats.sumRarity[card.rarity] = 0
    }
    stats.sumRarity[card.rarity] += stats.cards[cardName]

    // Handle card cost
    if (!(card.cost in stats.sumCosts)) {
      stats.sumCosts[card.cost] = 0
    }
    stats.sumCosts[card.cost] += stats.cards[cardName]

    // Handle card class
    if (!(card.class in stats.sumCardClasses)) {
      stats.sumCardClasses[card.class] = 0
    }
    stats.sumCardClasses[card.class] += stats.cards[cardName]
  }
}
