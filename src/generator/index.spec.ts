import generate from '.'

const rules = [
  {
    when: 'fruit',
    transform: ['lowercase', 'slugify'],
    sink: 'fruit',
  },
  {
    when: 'wasd',
    transform: ['slugify', 'lowercase'],
    sink: 'ijkl',
  },
]

test('generates code', async () => {
  const code = generate({ rules }) // ?
  expect(code).toBeTruthy()
})
