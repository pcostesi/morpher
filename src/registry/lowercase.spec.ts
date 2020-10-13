import { TransformationPayload } from 'index'
import lowercase from './lowercase'

describe('Library', () => {
  it('lowercase', () => {
    const input: TransformationPayload = {
      when: '',
      sink: '',
      data: 'THE THING',
    }
    expect(lowercase(input)).toEqual('the thing')
  })
})
