export type QueryError = { startPos: number; endPos: number; message: string }

export type TokenType =
  | 'int'
  | 'str'
  | 'negate'
  | 'identifier'
  | 'compareOperator'
  | 'openParen'
  | 'closeParen'
  | 'or'
  | 'EOF'

const compareOperator = ['=', ':', '<', '>', '<=', '>='] as const

export type CompareOperator = (typeof compareOperator)[number]

export type Token =
  | {
      type: 'int'
      startPos: number
      endPos: number
      value: number
    }
  | {
      type: 'compareOperator'
      startPos: number
      endPos: number
      value: CompareOperator
    }
  | {
      type: Exclude<TokenType, 'int' | 'compareOperator'>
      startPos: number
      endPos: number
      value: string
    }

export class Scanner {
  input: string
  tokens: Token[]
  pointer: number
  char: number
  errors: QueryError[]

  constructor(input: string) {
    input = input.trimEnd()

    this.input = input
    this.tokens = []
    this.pointer = 0
    this.char = 1
    this.errors = []
  }

  scan(): QueryError[] {
    while (!this.#isAtEnd()) {
      const current = this.#peek()

      if (current === '(') {
        this.#addToken('openParen', '(')
        this.#increment()
        continue
      }
      if (current === ')') {
        this.#addToken('closeParen', ')')
        this.#increment()
        continue
      }
      if (current === '-') {
        this.#addToken('negate', '-')
        this.#increment()
        continue
      }

      if (/\s/.test(current)) {
        this.#increment()
        continue
      }

      if ('"' === current) {
        const startPos = this.char

        this.#increment()
        let str = ''

        while (!this.#isAtEnd() && this.#peek() !== '"') {
          if (this.#peek() === '\\') {
            this.#increment()
            if (this.#peek() === 'n') {
              str += '\n'
            } else if (this.#peek() === '"') {
              str += '"'
            } else {
              this.errors.push({
                startPos: this.char - 1,
                endPos: this.char + 1,
                message: 'Unknown escape code.',
              })
            }
            this.#increment()
          } else {
            str += this.#peek()
            this.#increment()
          }
        }

        if (this.#isAtEnd()) {
          this.errors.push({
            startPos,
            endPos: this.char,
            message: 'Expected an ending string literal `"`.',
          })
        }

        this.#increment()

        this.#addToken('str', str, startPos)
        continue
      }

      if (['=', ':', '<', '>'].includes(current)) {
        this.#comparisonOperator()
      } else {
        this.#identifierOrNumber()
      }
    }
    this.#increment()
    this.#addToken('EOF', '')
    return this.errors
  }

  #addToken<T extends TokenType>(
    type: T,
    value: T extends 'int' ? number : T extends 'compareOperator' ? CompareOperator : string,
    startPos = this.char,
    endPos: number = this.char,
  ) {
    this.tokens.push({
      type,
      value,
      startPos,
      endPos,
    } as Token)
  }

  #isAtEnd(): boolean {
    return this.pointer >= this.input.length
  }
  #peek(): string {
    return this.input[this.pointer]
  }
  #increment() {
    this.pointer += 1
    this.char += 1
  }

  #comparisonOperator() {
    const startPos = this.char
    if (this.#peek() === ':' || this.#peek() === '=') {
      this.#addToken('compareOperator', this.#peek() as CompareOperator, startPos)
      this.#increment()
    } else {
      const firstPart = this.#peek()
      this.#increment()
      if (this.#peek() === '=') {
        this.#increment()
        this.#addToken('compareOperator', (firstPart + '=') as CompareOperator, startPos)
      } else {
        this.#addToken('compareOperator', firstPart as CompareOperator, startPos)
      }
    }
  }

  #identifierOrNumber() {
    const startPos = this.char
    let str = ''

    while (
      !this.#isAtEnd() &&
      ![' ', '\n', '\t', '\r', '(', ')', '=', ':', '<', '>'].includes(this.#peek())
    ) {
      str += this.#peek()
      this.#increment()
    }

    if (/^\d+$/.test(str)) {
      this.#addToken('int', parseInt(str), startPos)
    } else {
      if (str.toLowerCase() === 'or') {
        this.#addToken('or', str, startPos)
      } else if (compareOperator.includes(str as CompareOperator)) {
        this.#addToken('compareOperator', str as CompareOperator, startPos)
      } else {
        this.#addToken('identifier', str, startPos)
      }
    }
  }
}
