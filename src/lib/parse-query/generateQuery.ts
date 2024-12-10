import type { Query } from '../types'
import { Parser } from './parser'
import { type QueryError, Scanner } from './scanner'

export default function generateQuery(input: string): {
  errors: QueryError[]
  query: Query
} {
  const scanner = new Scanner(input)
  let errors = scanner.scan()
  const tokens = scanner.tokens
  const parser = new Parser(tokens)
  errors = [...errors, ...parser.parse()]

  return {
    errors,
    query: parser.query,
  }
}
