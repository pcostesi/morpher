import setter from './setter'

describe('Setter', () => {
  it('returns the same object that sets', () => {
    const obj = {}
    const result = setter(obj, 'fruit', 'banana')
    expect(result).toBe(obj)
  })

  it('sets a direct property', () => {
    const result = setter({}, 'fruit', 'banana')
    expect(result).toHaveProperty('fruit', 'banana')
  })

  it('sets a nested property', () => {
    const result = setter({}, 'edible.food.fruit', 'banana')
    expect(result).toHaveProperty('edible.food.fruit', 'banana')
  })
})
