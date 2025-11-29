import * as fs from 'fs'
import { type Stats } from './createStats.ts'
import { getCard } from './utils.ts'
import type { BestAndWorstCollection } from '../src/lib/types.ts'

export default function createBestWorst(stats: Stats): BestAndWorstCollection {
  const bestWorst: BestAndWorstCollection = {
    best: [],
    worst: [],
    classes: {},
  }
  const sortedCards = Object.entries(stats.cards)
    .map(([cardName, usage]) => {
      const card = getCard(cardName)
      return { card: cardName, usage: usage / stats.classDecks[card.class] }
    })
    .sort((a, b) => b.usage - a.usage)
  bestWorst.best = sortedCards.slice(0, 10)
  bestWorst.worst = sortedCards.slice(-10)

  // Now get cards by classes starting with best
  // We do loop through these cards multiple times. It could
  // be more optimized, but it does not really matter when I
  // run this manually and when the size of the array is only
  // around 500
  for (let i = 0; i < sortedCards.length; i++) {
    const card = getCard(sortedCards[i].card)

    // Handle defaults
    if (!(card.class in bestWorst.classes)) {
      bestWorst.classes[card.class] = {
        best: [],
        worst: [],
      }
    }

    if (bestWorst.classes[card.class].best.length < 10) {
      bestWorst.classes[card.class].best.push(sortedCards[i])
    }
  }

  // Now do worst
  for (let i = sortedCards.length - 1; i >= 0; i--) {
    const card = getCard(sortedCards[i].card)

    if (bestWorst.classes[card.class].worst.length < 10) {
      bestWorst.classes[card.class].worst.unshift(sortedCards[i])
    }
  }

  fs.writeFile('./data-summary/bestWorst.json', JSON.stringify(bestWorst), (err) => {
    if (err) throw err
    console.log('BestWorst saved.')
  })

  return bestWorst
}
