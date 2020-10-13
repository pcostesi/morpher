import required from './required'

describe('Library', () => {
  it('throws an error on missing value', () => {
    expect(() =>
      required({ when: 'thing', sink: '', data: undefined })
    ).toThrowError('Missing required value for thing')
  })

  it('returns the same value when it is valid', () => {
    const valid = {}
    const result = required({ when: '', sink: '', data: valid })
    expect(result).toBe(valid)
  })
})
