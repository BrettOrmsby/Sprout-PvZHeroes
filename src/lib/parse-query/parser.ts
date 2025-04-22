import type { CompareOperator, QueryError, Token, TokenType } from './scanner'
import type { Query, SubQuery } from '@/lib/types'

const properties = [
  'strength',
  's',
  'health',
  'h',
  'cost',
  'c',
  'set', // no short form
  'rarity',
  'r',
  'class', // no short form
  'tribe',
  'type',
  't',
  'abilities',
  'a',
  'flavour',
  'f',
  'is', // no short form
  'include',
  'i',
] as const

export type Property = (typeof properties)[number]

const numberProperties = ['strength', 's', 'health', 'h', 'cost', 'c'] as const
export type NumberProperty = (typeof numberProperties)[number]
export type NumberPropertyNormalized = Exclude<NumberProperty, 's' | 'h' | 'c'>

export class Parser {
  tokens: Token[]
  pointer: number
  query: Query
  errors: QueryError[]

  constructor(tokens: Token[]) {
    this.tokens = tokens
    this.pointer = 0
    this.query = {
      query: [],
      includeRemoved: false,
      includeSuperpowers: false,
      includeTokens: false,
    }
    this.errors = []
  }
  parse(): QueryError[] {
    const result = this.#parseSection(true)
    this.query.query = result

    return this.errors
  }

  #parseSection(isInRoot: boolean): SubQuery {
    // increment past the `(` character
    if (!isInRoot && this.#peek().type === 'openParen') {
      this.#increment()
    }

    let isNegated = false
    let root: SubQuery = []
    let section: { property: 'or'; orSections: SubQuery[] } | null = null
    let target: SubQuery = root
    while (!this.#isAtEnd()) {
      const current = this.#peek()

      // return the section when hitting a `)` unless in the root witch would be an error
      if ('closeParen' === current.type) {
        if (isNegated) {
          target.push({ property: 'name', value: '-', isNegated: false })
          isNegated = false
        }
        if (isInRoot) {
          this.errors.push({
            startPos: current.startPos,
            endPos: current.endPos,

            message: 'Unexpected closing parenthesis.',
          })
          this.#increment()
          continue
        }
        this.#increment()
        return root
      }

      if (current.type === 'negate') {
        isNegated = !isNegated
        this.#increment()
        continue
      }

      const propertyName = this.#normalizeProperty(
        current.value.toString().toLowerCase() as Property,
      )
      if (
        current.type === 'identifier' &&
        properties.includes(propertyName) &&
        this.#expect('compareOperator')
      ) {
        this.#increment()
        const operator = this.#peek()
        this.#increment()

        if (numberProperties.includes(propertyName as NumberProperty)) {
          const next = this.#peek()
          if (next.type === 'int') {
            target.push({
              property: propertyName as NumberPropertyNormalized,
              compare: operator.value as CompareOperator,
              value: next.value,
              isNegated,
            })
            isNegated = false
          } else {
            this.errors.push({
              startPos: next.startPos,
              endPos: next.endPos,
              message: `Expected a number value for property "${propertyName}".`,
            })
          }
          this.#increment()
          continue
        } else {
          if (operator.value !== '=' && operator.value !== ':') {
            this.errors.push({
              startPos: operator.startPos,
              endPos: operator.endPos,
              message: `Expected an "=" or ":" operator for property "${propertyName}".`,
            })
          }
          if (
            this.#peek().type === 'openParen' ||
            this.#peek().type === 'closeParen' ||
            this.#peek().type === 'EOF'
          ) {
            this.errors.push({
              startPos: this.#peek().startPos,
              endPos: this.#peek().endPos,
              message: `Expected a non-parenthesis value for property "${propertyName}".`,
            })
            continue
          }

          const valueToken = this.#peek()
          const value = this.#normalizeValue(propertyName, valueToken.value.toString())

          const validValues: Record<string, string[]> = {
            set: [
              'basic',
              'premium',
              'galactic',
              'colossal',
              'triassic',
              'event',
              'token',
              'superpower',
            ],
            rarity: ['common', 'uncommon', 'rare', 'superrare', 'legendary', 'event', 'token'],
            class: [
              'guardian',
              'kabloom',
              'megagrow',
              'smarty',
              'solar',
              'beastly',
              'brainy',
              'crazy',
              'hearty',
              'sneaky',
            ],
            type: ['plant', 'trick', 'environment', 'zombie', 'fighter'],
            is: ['plant', 'zombie'],
            include: ['token', 'removed', 'all', 'superpower'],
          }

          if (validValues[propertyName] && !validValues[propertyName].includes(value)) {
            console.log(value)
            this.errors.push({
              startPos: valueToken.startPos,
              endPos: valueToken.endPos,
              message: `Expected a valid ${propertyName} value.`,
            })
            this.#increment()
            continue
          }

          if (propertyName === 'include') {
            if (['all', 'token'].includes(value)) {
              this.query.includeTokens = true
            }
            if (['all', 'removed'].includes(value)) {
              this.query.includeRemoved = true
            }
            if (['all', 'superpower'].includes(value)) {
              this.query.includeSuperpowers = true
            }
          } else {
            target.push({
              property: propertyName,
              value: value,
              isNegated,
            } as SubQuery[number])
          }
          isNegated = false
        }
        this.#increment()
        continue
      }

      if ('or' === current.type) {
        if (isNegated) {
          target.push({ property: 'name', value: '-', isNegated: false })
          isNegated = false
        }
        if (!section) {
          root = [
            {
              property: 'or',
              orSections: [target],
            },
          ]
          target = []
          section = root[0] as {
            property: 'or'
            orSections: SubQuery[]
          }
          section!.orSections.push(target)
        } else {
          target = []
          section.orSections.push(target)
        }
        this.#increment()
        continue
      }

      if ('openParen' === current.type) {
        if (isNegated) {
          target.push({ property: 'name', value: '-', isNegated: false })
          isNegated = false
        }
        const innerSection = this.#parseSection(false)
        for (const value of innerSection) {
          target.push(value)
        }
        continue
      }

      target.push({ property: 'name', value: current.value as string, isNegated })
      isNegated = false
      this.#increment()
      continue
    }
    if (!isInRoot) {
      this.errors.push({
        startPos: this.#peek().startPos,
        endPos: this.#peek().endPos,
        message: `Expected an closing parenthesis ")".`,
      })
    }
    if (isNegated) {
      target.push({ property: 'name', value: '-', isNegated: false })
    }
    return root
  }

  #isAtEnd(): boolean {
    return this.pointer >= this.tokens.length || this.tokens[this.pointer].type === 'EOF'
  }
  #peek(): Token {
    if (this.#isAtEnd()) {
      return this.tokens[this.tokens.length - 1]
    }
    return this.tokens[this.pointer]
  }
  #increment() {
    this.pointer += 1
  }
  #decrement() {
    this.pointer -= 1
  }
  #expect(type: TokenType, value?: string): boolean {
    this.#increment()
    if (this.#isAtEnd()) {
      this.#decrement()
      return type === 'EOF'
    }
    const isExpected =
      this.#peek().type === type && (!value || (value && value === this.#peek().value))
    this.#decrement()
    return isExpected as boolean
  }
  #normalizeProperty(property: Property): Property {
    // Note: t is not really a short form, it is queried differently
    const shortForms: Record<string, Property> = {
      s: 'strength',
      h: 'health',
      c: 'cost',
      a: 'abilities',
      i: 'include',
      f: 'flavour',
      r: 'rarity',
    }
    return shortForms[property] || property
  }
  #normalizeValue(property: Property, value: string): string {
    const v = value.toLowerCase()

    switch (property) {
      case 'set':
        return (
          {
            b: 'basic',
            p: 'premium',
            g: 'galactic',
            c: 'colossal',
            t: 'triassic',
            e: 'event',
            s: 'superpower',
          }[v] || v
        )

      case 'rarity':
      case 'r':
        const deHyphen = v.replace(/[ -]/g, '')
        return (
          {
            c: 'common',
            u: 'uncommon',
            r: 'rare',
            s: 'superrare',
            l: 'legendary',
            e: 'event',
            t: 'token',
          }[deHyphen] || deHyphen
        )

      case 'type':
      case 't':
        return (
          {
            p: 'plant',
            z: 'zombie',
            t: 'trick',
            e: 'environment',
            f: 'fighter',
          }[v] || v
        )

      case 'is':
        return (
          {
            p: 'plant',
            z: 'zombie',
          }[v] || v
        )

      case 'include':
      case 'i':
        return (
          {
            t: 'token',
            r: 'removed',
            s: 'superpower',
            a: 'all',
          }[v] || v
        )

      case 'class':
        return v.replace(/[ -]/g, '')

      default:
        return v
    }
  }
}
