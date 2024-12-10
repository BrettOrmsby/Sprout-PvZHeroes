import type { TokenType, Token, QueryError, CompareOperator } from './scanner'
import type { Query } from '@/lib/types'

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
] as const

export type Property = (typeof properties)[number]

const numberProperties = ['strength', 's', 'health', 'h', 'cost', 'c'] as const
export type NumberProperty = (typeof numberProperties)[number]

export class Parser {
  tokens: Token<TokenType>[]
  pointer: number
  query: Query
  errors: QueryError[]

  constructor(tokens: Token<TokenType>[]) {
    this.tokens = tokens
    this.pointer = 0
    this.query = []
    this.errors = []
  }
  parse(): QueryError[] {
    const result = this.#parseSection(true)
    this.query = result

    return this.errors
  }

  #parseSection(isInRoot: boolean): Query {
    // increment past the `(` character
    if (!isInRoot && this.#peek().type === 'openParen') {
      this.#increment()
    }

    let isNegated = false
    let root: Query = []
    let section: { property: 'or'; orSections: Query[] } | null = null
    let target: Query = root
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

      if (
        current.type === 'identifier' &&
        properties.includes(current.value.toString().toLowerCase() as any) &&
        this.#expect('compareOperator')
      ) {
        const propertyName = current.value.toString().toLowerCase() as Property
        this.#increment()
        const operator = this.#peek()
        this.#increment()

        if (numberProperties.includes(propertyName as any)) {
          if (this.#peek().type === 'int') {
            target.push({
              property: propertyName as NumberProperty,
              compare: operator.value as CompareOperator,
              value: this.#peek().value as number,
              isNegated,
            })
            isNegated = false
          } else {
            this.errors.push({
              startPos: this.#peek().startPos,
              endPos: this.#peek().endPos,
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

          if (propertyName === 'set') {
            if (
              ![
                'basic',
                'b',
                'premium',
                'p',
                'galactic',
                'g',
                'colossal',
                'c',
                'triassic',
                't',
                'event',
                'e',
                'token',
                'superpower',
                's',
              ].includes((valueToken.value as string).toLowerCase())
            ) {
              this.errors.push({
                startPos: valueToken.startPos,
                endPos: valueToken.endPos,
                message: `Expected a valid set name or set short form.`,
              })
              this.#increment()
              continue
            }
            valueToken.value = valueToken.value.toString().toLowerCase()
          }

          if (propertyName === 'rarity' || propertyName === 'r') {
            const normalizedRarity = valueToken.value.toString().toLowerCase().replace(/[ -]/g, '')
            if (
              ![
                'common',
                'c',
                'uncommon',
                'u',
                'rare',
                'r',
                'superrare',
                's',
                'legendary',
                'l',
                'event',
                'e',
                'token',
                't',
              ].includes(normalizedRarity)
            ) {
              this.errors.push({
                startPos: valueToken.startPos,
                endPos: valueToken.endPos,
                message: `Expected a valid rarity or rarity short form.`,
              })
              this.#increment()
              continue
            }
            valueToken.value = normalizedRarity
          }

          if (propertyName === 'class') {
            const normalizedClass = valueToken.value.toString().toLowerCase().replace(/[ -]/g, '')
            if (
              ![
                'guardian',
                'kabloom',
                'megagrow',
                'smarty',
                'solar',
                'removed',
                'beastly',
                'brainy',
                'crazy',
                'hearty',
                'sneaky',
              ].includes(normalizedClass)
            ) {
              this.errors.push({
                startPos: valueToken.startPos,
                endPos: valueToken.endPos,
                message: `Expected a valid class name.`,
              })
              this.#increment()
              continue
            }
            valueToken.value = normalizedClass
          }

          if (propertyName === 'type') {
            if (
              ![
                'plant',
                'trick',
                'environment',
                'zombie',
                'p',
                'z',
                't',
                'e',
                'fighter',
                'f',
              ].includes((valueToken.value as string).toLowerCase())
            ) {
              this.errors.push({
                startPos: valueToken.startPos,
                endPos: valueToken.endPos,
                message: `Expected a valid type name or type short form.`,
              })
              this.#increment()
              continue
            }
            valueToken.value = valueToken.value.toString().toLowerCase()
          }

          target.push({
            property: propertyName as any,
            value: valueToken.value,
            isNegated,
          })
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
          section = root[0] as any
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

      target.push({ property: 'name', value: current.value, isNegated })
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
  #peek(): Token<TokenType> {
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
}
