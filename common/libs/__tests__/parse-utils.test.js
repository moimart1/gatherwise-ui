import { describe, expect, it, test } from 'vitest'
import { parseExpiresIn, parseUserAgentString } from '../parse-utils'

describe('The parseExpiresIn util', () => {
  test('Parses an expiresIn in seconds', () => {
    const mockExpiresIn = 123
    const expected = '123s'
    expect(parseExpiresIn(mockExpiresIn)).toBe(expected)
  })

  test('Throws if given a string', () => {
    const mockExpiresIn = '12d'
    expect(() => parseExpiresIn(mockExpiresIn)).toThrow()
  })

  test('Throws if given an unexpected type', () => {
    expect(() => parseExpiresIn(null)).toThrow()
  })
})

describe('The parseUserAgentString util', () => {
  it('returns Mac OS X if Mac OS X is in the user agent string', () => {
    const mockUserAgentString =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
    const expected = 'Mac OS X'
    expect(parseUserAgentString(mockUserAgentString)).toBe(expected)
  })

  it('returns UNSUPPORTED if it is garbage', () => {
    const mockUserAgentString = 'foo'
    const expected = 'UNSUPPORTED'
    expect(parseUserAgentString(mockUserAgentString)).toBe(expected)
  })
})
