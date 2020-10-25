import Morpher, { MorphOptions } from '.'

describe('Morph', () => {
  it('no-op to be no-op', () => {
    const output = {}
    const input = {}
    const opts = {
      rules: [],
    }
    const morpher = new Morpher(opts)
    expect(morpher.apply(input)).toEqual(output)
  })

  it('lowercases the fruit', () => {
    const input = {
      fruit: 'BANANA',
    }
    const expected = {
      fruit: 'banana',
    }
    const opts: MorphOptions = {
      rules: [
        {
          when: 'fruit',
          transform: ['lowercase'],
          sink: 'fruit',
        },
      ],
    }
    const morpher = new Morpher(opts)
    expect(morpher.apply(input)).toEqual(expected)
  })

  it('throws error on missing transformation', () => {
    const input = {}
    const opts: MorphOptions = {
      rules: [
        {
          when: 'fruit',
          transform: ['missing'],
          sink: 'fruit',
        },
      ],
    }
    const morpher = new Morpher(opts)
    expect(() => {
      morpher.apply(input)
    }).toThrowError('Missing transformation <missing>')
  })

  it('skips missing property', () => {
    const input = {}
    const opts: MorphOptions = {
      rules: [
        {
          when: 'fruit',
          transform: ['lowercase'],
          sink: 'fruit',
        },
      ],
    }
    const morpher = new Morpher(opts)
    expect(morpher.apply(input)).toHaveProperty('fruit', undefined)
  })

  it('works composing functions', () => {
    const input = { fruit: 'Banana' }
    const opts: MorphOptions = {
      rules: [
        {
          when: 'fruit',
          transform: ['lowercase', '*'],
          sink: 'fruit',
        },
      ],
    }
    const morpher = new Morpher(opts)
    const result = morpher.apply(input)
    expect(result).toEqual({ fruit: 'banana' })
  })
})
