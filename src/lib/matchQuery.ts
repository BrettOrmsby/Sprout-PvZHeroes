import type { CompareOperator } from './parse-query/scanner'
import type { Card, Query } from './types'

export default function doesMatchQuery(
  card: Card,
  query: Query,
  include = { tokens: false, removed: false, superpowers: false },
): boolean {
  for (const subQuery of query) {
    if (subQuery.property === 'or') {
      const isSomeCorrect = subQuery.orSections.some(
        (orQuery) => orQuery.length !== 0 && doesMatchQuery(card, orQuery, include),
      )
      if (!isSomeCorrect) {
        return false
      }
    } else {
      if (subQuery.property === 'name') {
        const doesNameMatch = card.name
          .toLowerCase()
          .includes(subQuery.value.toString().toLowerCase())
        if (doesNameMatch === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'strength' || subQuery.property === 's') {
        const doesStrengthMatch =
          card.strength !== null && equalityCheck(card.strength, subQuery.compare, subQuery.value)
        if (doesStrengthMatch === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'health' || subQuery.property === 'h') {
        const doesHealthMatch =
          card.health !== null && equalityCheck(card.health, subQuery.compare, subQuery.value)
        if (doesHealthMatch === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'cost' || subQuery.property === 'c') {
        const doesCostMatch =
          card.cost !== null && equalityCheck(card.cost, subQuery.compare, subQuery.value)
        if (doesCostMatch === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'set') {
        let set = subQuery.value.toLowerCase()
        if (set.length === 1) {
          const shortFormSets = {
            b: 'basic',
            p: 'premium',
            g: 'galactic',
            c: 'colossal',
            t: 'triassic',
            e: 'event',
            s: 'superpower',
          }
          set = shortFormSets[set as keyof typeof shortFormSets]
        }
        const doesMatchSet = card.set.toLowerCase() === set
        if (doesMatchSet === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'rarity' || subQuery.property === 'r') {
        let rarity = subQuery.value
        if (rarity.length === 1) {
          const shortFormRarities = {
            c: 'common',
            u: 'uncommon',
            r: 'rare',
            s: 'superrare',
            l: 'legendary',
            e: 'event',
            t: 'token',
          } as const
          rarity = shortFormRarities[rarity as keyof typeof shortFormRarities]
        }

        const doesMatchRarity = card.rarity.toLowerCase().replace('-', '') === rarity
        if (doesMatchRarity === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'class') {
        const doesMatchClass = card.class.toLowerCase().replace(/[ -]/g, '') === subQuery.value
        if (doesMatchClass === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'type') {
        let type = subQuery.value
        if (type.length === 1) {
          const shortFormTypes = {
            p: 'plant',
            z: 'zombie',
            t: 'trick',
            e: 'environment',
            f: 'fighter',
          } as const
          type = shortFormTypes[type as keyof typeof shortFormTypes]
        }
        const doesMatchType =
          card.type.toLowerCase() === type ||
          (type === 'fighter' &&
            (card.type.toLowerCase() === 'zombie' || card.type.toLowerCase() === 'plant'))
        if (doesMatchType === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'is') {
        let value = subQuery.value
        if (value.length === 1) {
          const shortFormValues = {
            p: 'plant',
            z: 'zombie',
          } as const
          value = shortFormValues[value as keyof typeof shortFormValues]
        }
        const doesMatchType =
          (value === 'plant' &&
            ['Guardian', 'Kabloom', 'Mega-Grow', 'Smarty', 'Solar'].includes(card.class)) ||
          (value === 'zombie' &&
            ['Beastly', 'Brainy', 'Crazy', 'Hearty', 'Sneaky'].includes(card.class))
        if (doesMatchType === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'tribe') {
        const doesMatchTribe = [...card.tribes].some((tribe) =>
          tribe.toLowerCase().includes(subQuery.value.toString().toLowerCase()),
        )
        if (doesMatchTribe === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 't') {
        const doesMatchT = [...card.tribes, card.type].some((t) =>
          t.toLowerCase().includes(subQuery.value.toString().toLowerCase()),
        )
        if (doesMatchT === subQuery.isNegated) {
          return false
        }
        continue
      }

      if (subQuery.property === 'abilities' || subQuery.property === 'a') {
        const doesMatchAbilities = card.abilities
          .toLowerCase()
          .replace(/<[^>]*?>/g, '')
          .replace(/{{[^:}]+}}/g, '')
          .replace(/{{([^:}]+):[^}]+?}}/g, '$1')
          .includes(subQuery.value.toString().toLowerCase())
        if (doesMatchAbilities === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'flavour' || subQuery.property === 'f') {
        const doesMatchFlavour = card.flavour
          .toLowerCase()
          .includes(subQuery.value.toString().toLowerCase())
        if (doesMatchFlavour === subQuery.isNegated) {
          return false
        }
        continue
      }
      if (subQuery.property === 'include' || subQuery.property === 'i') {
        const value = subQuery.value
        if (value === 'token' || value === 't' || value === 'a' || value === 'all') {
          include = { ...include, tokens: true }
        }
        if (value === 'removed' || value === 'r' || value === 'a' || value === 'all') {
          include = { ...include, removed: true }
        }
        if (value === 'superpower' || value === 's' || value === 'a' || value === 'all') {
          include = { ...include, superpowers: true }
        }
        continue
      }
    }
  }

  if (!include.removed && card.class === 'Removed') {
    return false
  }
  if (!include.tokens && card.set === 'token') {
    return false
  }
  if (!include.superpowers && card.tribes.includes('Superpower')) {
    return false
  }
  return true
}

function equalityCheck(firstVal: number, op: CompareOperator, secondVal: number): boolean {
  if (op === ':' || op === '=') return firstVal === secondVal
  if (op === '<') return firstVal < secondVal
  if (op === '>') return firstVal > secondVal
  if (op === '<=') return firstVal <= secondVal
  return firstVal >= secondVal
}
