import getCard from '@/lib/getCard'
import { type Card, type CardRenderData, type CardType } from '@/lib/types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const MAX_GUESSES = 9

export const useSpyrisStore = defineStore('spyris', () => {
  const isHowToPlayOpen = ref(false)
  const isSymbolModalOpen = ref(false)

  const gameState = useLocalStorage<'play' | 'won' | 'lost'>('spyris-gameState', 'play')
  const answer = useLocalStorage('spyris-answer', getCard('Galacta-Cactus'))
  const guesses = useLocalStorage<string[]>('spyris-guesses', [])
  const guessesRemaining = useLocalStorage('spyris-guessesRemaining', MAX_GUESSES)
  const cardRender = useLocalStorage<CardRenderData>('spyris-cardRender', {
    className: 'unknown',
    name: '',
    type: 'fighter',
    tribes: [],
    abilities: '',
    set: '',
    rarity: 'common',
    flavour: '',
    cost: 0,
    strength: 0,
    health: 0,
    strengthImg: 'strength',
    healthImg: 'heart',
    img: '',
    imgWidth: 0,
    imgXOffset: 0,
    imgYOffset: 0,
    backgroundColour: 'transparent',
    overrideShowStats: true,
    typeText: '',
    rarityText: '',
  })

  const setCard = (card: Card) => {
    gameState.value = 'play'
    guesses.value = []
    guessesRemaining.value = MAX_GUESSES
    answer.value = card
    cardRender.value = {
      className: 'unknown',
      name: toUnserscores(card.name),
      type: normalizeCardType(card.type),
      tribes: card.tribes.map(toUnserscores),
      abilities: toUnserscores(normalizeAbilities(card.abilities)),
      set: card.set === 'event' ? '' : toUnserscores(card.set),
      flavour: toUnserscores(card.flavour),
      rarity: 'common',
      strengthImg: 'strength',
      healthImg: 'heart',
      cost: toUnserscores(card.cost.toString()),
      strength: toQuestions(card.strength),
      health: toQuestions(card.strength),

      overrideShowStats: true,
      typeText: toUnserscores(card.type),
      rarityText: toUnserscores(card.rarity),

      img: '',
      imgWidth: 0,
      imgXOffset: 0,
      imgYOffset: 0,
      backgroundColour: 'transparent',
    }
  }

  const guess = (key: string) => {
    if (guessesRemaining.value <= 1) return
    if (guesses.value.includes(key)) return

    guessesRemaining.value -= 1
    guesses.value.push(key)

    cardRender.value.abilities = decodeMessage(
      cardRender.value.abilities,
      normalizeAbilities(answer.value.abilities),
      key,
      '_',
      [...answer.value.abilities.matchAll(/\{\{(.+?)\}\}/g)]
        .map((match) => match[1])
        .filter((val) => !val.includes(':')),
    )
    cardRender.value.name = decodeMessage(cardRender.value.name, answer.value.name, key)
    cardRender.value.tribes = answer.value.tribes.map((tribe, i) =>
      decodeMessage(cardRender.value.tribes[i], tribe, key),
    )

    cardRender.value.set = decodeMessage(cardRender.value.set, answer.value.set, key)
    cardRender.value.flavour = decodeMessage(cardRender.value.flavour, answer.value.flavour, key)
    cardRender.value.typeText = decodeMessage(cardRender.value.typeText!, answer.value.type, key)
    cardRender.value.rarityText = decodeMessage(
      cardRender.value.rarityText!,
      answer.value.rarity,
      key,
    )
    cardRender.value.cost = decodeMessage(
      cardRender.value.cost.toString(),
      answer.value.cost.toString(),
      key,
    )

    cardRender.value.strength = decodeMessage(
      cardRender.value.strength.toString(),
      answer.value.strength?.toString() ?? '?',
      key,
      '?',
    )
    cardRender.value.health = decodeMessage(
      cardRender.value.health.toString(),
      answer.value.health?.toString() ?? '?',
      key,
      '?',
    )

    if (!cardRender.value.name.includes('_')) {
      gameState.value = 'won'
    } else if (guessesRemaining.value <= 0) {
      gameState.value = 'lost'
    }
  }

  const guessAnswer = (guess: string) => {
    guessesRemaining.value -= 1
    if (guess.toLowerCase() === answer.value.name.toLowerCase()) {
      gameState.value = 'won'
    } else if (guessesRemaining.value <= 0) {
      gameState.value = 'lost'
    }
  }

  return {
    MAX_GUESSES,
    isHowToPlayOpen,
    isSymbolModalOpen,
    gameState,
    cardRender,
    answer,
    guesses,
    guessesRemaining,
    setCard,
    guess,
    guessAnswer,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSpyrisStore, import.meta.hot))
}

function decodeMessage(
  coded: string,
  reference: string,
  key: string,
  codeChar = '_',
  images: string[] = [],
): string {
  let output = ''
  const referenceAlphanumeric = reference
    .replace(/\{\{(.+?)\}\}/g, '')
    .replace(/[^A-Za-z0-9_@]/g, '')
    .split('')

  let imageIndex = 0
  let referenceIndex = 0
  const chars = coded.split('')
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]

    if (char === '{') {
      i += 2
      output += '{{'
      while (chars[i] !== '}') {
        output += chars[i]
        i++
      }
      output += '}}'
      i++
      continue
    }

    if (char !== codeChar) {
      output += char
      if (/[A-Za-z0-9_]/.test(char)) referenceIndex++
      continue
    }

    if (referenceAlphanumeric[referenceIndex] === '@') {
      if (key.toLowerCase() === images[imageIndex].toLowerCase()) {
        output += `{{${key}}}`
      } else {
        output += '_'
      }
      imageIndex += 1
      referenceIndex++
      continue
    }

    if (referenceAlphanumeric[referenceIndex]?.toLowerCase() === key.toLowerCase()) {
      // Need to remove the adjacent spaces if this is surrounded by underscores
      if (
        output.charAt(output.length - 2) === codeChar &&
        /\s/.test(output.charAt(output.length - 1))
      ) {
        output = output.slice(0, -1)
      }

      output += referenceAlphanumeric[referenceIndex]

      // This is removing the ending space
      if (/\s/.test(chars[i + 1]) && !/\s/.test(chars[i + 2])) {
        i++
      }
      referenceIndex += 1
      continue
    }

    referenceIndex += 1
    output += char
  }

  return output
}

function toUnserscores(str: string) {
  return str.replace(/ /g, '  ').replace(/[a-zA-Z0-9@]/g, '_' + String.fromCharCode(160)) // 160 = &npsp;
}

function toQuestions(val: string | number | null) {
  return (
    val
      ?.toString()
      ?.replace(/ /g, '  ')
      ?.replace(/[a-zA-Z0-9]/g, '?') ?? '?'
  )
}

function normalizeAbilities(abilities: string) {
  return abilities
    .replace(/\{\{(.+?)\}\}/g, (substr) => {
      if (substr.includes(':')) {
        return substr.split(':')[0].slice(2)
      }
      return '@'
    })
    .replace(/<b>(.+?)<\/b>/g, '$1')
}

function normalizeCardType(type: string): CardType {
  if (type === 'Plant' || type === 'Zombie') return 'fighter'
  if (type === 'Trick') return 'trick'
  return 'environment'
}
