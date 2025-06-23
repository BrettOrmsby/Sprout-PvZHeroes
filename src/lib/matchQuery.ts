import type { CompareOperator } from './parse-query/scanner'
import type { Card, Query } from './types'

export default function doesMatchQuery(card: Card, query: Query): boolean {
  if (!query.includeRemoved && card.class === 'Removed') {
    return false
  }
  if (!query.includeTokens && card.set === 'token') {
    return false
  }
  if (!query.includeSuperpowers && card.tribes.includes('Superpower')) {
    return false
  }

  for (const subQuery of query.query) {
    if (subQuery.property === 'or') {
      const isSomeCorrect = subQuery.orSections.some(
        (orQuery) => orQuery.length && doesMatchQuery(card, { ...query, query: orQuery }),
      )
      if (!isSomeCorrect) {
        return false
      }
    } else {
      let doesMatch = true
      switch (subQuery.property) {
        case 'name':
          doesMatch = card.name.toLowerCase().includes(subQuery.value)
          break
        case 'strength':
          doesMatch = equalityCheck(card.strength, subQuery.compare, subQuery.value)
          break
        case 'health':
          doesMatch = equalityCheck(card.health, subQuery.compare, subQuery.value)
          break
        case 'cost':
          doesMatch = equalityCheck(card.cost, subQuery.compare, subQuery.value)
          break
        case 'set':
          doesMatch = card.set.toLowerCase() === subQuery.value
          break
        case 'rarity':
          doesMatch = card.rarity.toLowerCase().replace('-', '') === subQuery.value
          break
        case 'class':
          doesMatch = card.class.toLowerCase().replace(/[ -]/g, '') === subQuery.value
          break
        case 'type':
          const type = card.type.toLowerCase()
          doesMatch =
            type === subQuery.value ||
            (subQuery.value === 'fighter' && (type === 'zombie' || type === 'plant'))
          break
        case 'is':
          doesMatch =
            (subQuery.value === 'plant' &&
              ['Guardian', 'Kabloom', 'Mega-Grow', 'Smarty', 'Solar'].includes(card.class)) ||
            (subQuery.value === 'zombie' &&
              ['Beastly', 'Brainy', 'Crazy', 'Hearty', 'Sneaky'].includes(card.class))
          break
        case 'tribe':
          doesMatch = [...card.tribes].some((tribe) => tribe.toLowerCase().includes(subQuery.value))
          break
        case 't':
          doesMatch = [...card.tribes, card.type].some((t) =>
            t.toLowerCase().includes(subQuery.value),
          )
          break
        case 'abilities':
          doesMatch = card.abilities
            .toLowerCase()
            .replace(/<[^>]*?>/g, '')
            .replace(/{{[^:}]+}}/g, '')
            .replace(/{{([^:}]+):[^}]+?}}/g, '$1')
            .includes(subQuery.value)
          break
        case 'flavour':
          doesMatch = card.flavour.toLowerCase().includes(subQuery.value)
          break
      }
      if (doesMatch === subQuery.isNegated) {
        return false
      }
    }
  }
  return true
}

function equalityCheck(firstVal: number | null, op: CompareOperator, secondVal: number): boolean {
  if (firstVal === null) return false
  if (op === ':' || op === '=') return firstVal === secondVal
  if (op === '<') return firstVal < secondVal
  if (op === '>') return firstVal > secondVal
  if (op === '<=') return firstVal <= secondVal
  return firstVal >= secondVal
}
