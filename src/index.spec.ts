import Morpher, { MorphOptions } from '.'

describe('Morph', () => {
  it('no-op to be no-op', () => {
    const output = {}
    const input = {}
    const opts = {
      rules: [],
    }
    const morpher = new Morpher(opts)
    expect(morpher.apply(input, output)).toEqual(output)
  })

  it('lowercases the fruit', () => {
    const output = {}
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
    expect(morpher.apply(input, output)).toEqual(expected)
  })

  it('throws error on missing transformation', () => {
    const output = {}
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
      morpher.apply(input, output)
    }).toThrowError('Missing transformation <missing>')
  })

  it('skips missing property', () => {
    const output = {}
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
    expect(morpher.apply(input, output)).toHaveProperty('fruit', undefined)
  })

  it('works composing functions', () => {
    const output = {}
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
    const result = morpher.apply(input, output)
    expect(result).toEqual({ fruit: 'banana' })
  })
})
