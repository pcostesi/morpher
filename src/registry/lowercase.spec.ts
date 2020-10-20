import lowercase from './lowercase'

describe('Library', () => {
  it('lowercase', () => {
    const input = 'THE THING'
    expect(lowercase(input)).toEqual('the thing')
  })
})
