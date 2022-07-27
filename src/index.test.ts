import { sum } from '.'

describe('index', () => {
  it('can sum two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
