import required from './required'

describe('Library', () => {
  it('throws an error on missing value', () => {
    expect(() => required(null, '', { when: 'thing', sink: '' })).toThrowError(
      'Missing required value for thing'
    )
  })

  it('returns the same value when it is valid', () => {
    const valid = {}
    const result = required(valid, '', { when: '', sink: '' })
    expect(result).toBe(valid)
  })
})
