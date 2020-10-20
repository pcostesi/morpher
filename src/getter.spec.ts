import getter, { compileGetter } from './getter'

describe('Getter', () => {
  it('gets a direct property', () => {
    const output = 'banana'
    const selector = 'fruit'
    const input = { fruit: output }

    expect(getter(input, selector)).toEqual(output)
  })

  it('returns undefined on missing prop', () => {
    const output = 'banana'
    const selector = 'fruit'
    const input = { sour: output }

    expect(getter(input, selector)).toEqual(undefined)
  })

  it('returns a deeply nested property', () => {
    const output = 'banana'
    const selector = 'food.fruit'
    const input = { food: { fruit: output } }

    expect(getter(input, selector)).toEqual(output)
  })

  it('does not return another property', () => {
    const output = 'banana'
    const selector = 'food.entre'
    const input = { food: { fruit: output } }

    expect(getter(input, selector)).toEqual(undefined)
  })
})

describe('Compiled Getter', () => {
  it('gets a direct property', () => {
    const output = 'banana'
    const selector = 'fruit'
    const compiled = compileGetter(selector)
    const input = { fruit: output }

    expect(compiled(input)).toEqual(output)
  })

  it('returns undefined on missing prop', () => {
    const output = 'banana'
    const selector = 'fruit'
    const compiled = compileGetter(selector)
    const input = { sour: output }

    expect(compiled(input)).toEqual(undefined)
  })

  it('returns a deeply nested property', () => {
    const output = 'banana'
    const selector = 'food.fruit'
    const compiled = compileGetter(selector)
    const input = { food: { fruit: output } }

    expect(compiled(input)).toEqual(output)
  })

  it('does not return another property', () => {
    const output = 'banana'
    const selector = 'food.entre'
    const compiled = compileGetter(selector)
    const input = { food: { fruit: output } }

    expect(compiled(input)).toEqual(undefined)
  })
})
