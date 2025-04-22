export type Deck = {
  id: string
  creator: string
  name: string
  is_private: boolean
  is_complete: boolean
  hero: string
  list: Record<string, number>
  created_at: string
  last_updated: string
  description: string
  hearts: number
}

export type Hero = {
  name: string
  image: string
  class: string[]
  mainSuperPower: string
  altSuperPowers: string[]
  description: string
}

export type Card = {
  name: string
  image: string
  set: string
  rarity: string
  class: string
  type: string
  tribes: string[]
  cost: number
  strength: number | null
  health: number | null
  abilities: string
  flavour: string
}

export type User = {
  username: string
  profile_image: string
  id: string
  created_at: string
  hearts: string[]
}

export type Notification = {
  id: string
  is_read: boolean
  recipient_id: string
  actor_id: string
  actor_name: string
  deck_id: string
  deck_name: string
  created_at: string
  type: 'heart'
}

export type Query = {
  includeTokens: boolean
  includeRemoved: boolean
  includeSuperpowers: boolean
  query: SubQuery
}

export type SubQuery = (
  | {
      property: 'strength' | 'health' | 'cost'
      compare: '=' | ':' | '<' | '>' | '<=' | '>='
      value: number
      isNegated: boolean
    }
  | {
      property: 'tribe' | 't' | 'abilities' | 'flavour' | 'name'
      value: string
      isNegated: boolean
    }
  | {
      property: 'set'
      value: 'basic' | 'premium' | 'galactic' | 'colossal' | 'triassic'

      isNegated: boolean
    }
  | {
      property: 'rarity'
      value: 'common' | 'uncommon' | 'rare' | 'superrare' | 'legendary' | 'event' | 'token'

      isNegated: boolean
    }
  | {
      property: 'class'
      value:
        | 'guardian'
        | 'kabloom'
        | 'megagrow'
        | 'smarty'
        | 'solar'
        | 'beastly'
        | 'brainy'
        | 'crazy'
        | 'hearty'
        | 'sneaky'
      isNegated: boolean
    }
  | {
      property: 'type'
      value: 'plant' | 'trick' | 'environment' | 'zombie' | 'fighter'
      isNegated: boolean
    }
  | {
      property: 'is'
      value: 'plant' | 'zombie'
      isNegated: boolean
    }
  | {
      property: 'or'
      orSections: SubQuery[]
    }
)[]
