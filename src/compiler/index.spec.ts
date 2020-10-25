// see: https://stackoverflow.com/a/55060771
// https://nodejs.org/dist/latest-v5.x/docs/api/vm.html#vm_vm_runinnewcontext_code_sandbox_options

import { createContext, Script } from 'vm'

import setter from '../setter'
import compile from '.'

const rules = [
  {
    when: 'fruit',
    transform: ['lowercase', 'slugify'],
    sink: 'fruit',
  },
  {
    when: 'w.a.s.d',
    transform: ['slugify', 'lowercase'],
    sink: 'i.j.k.l',
  },
]

const context = {
  globalThis: {} as any,
  set: setter,
  library: {
    abc: (data: string) => data,
    slugify: (data: string) => data.replace(/\s+/gi, '-').toLowerCase(),
    lowercase: (data: string) => data.toLowerCase(),
  },
}

test('compiles code', async () => {
  const code = compile({ rules })
  expect(code).toBeTruthy()
})

test('m returns string', async () => {
  const compiled = await compile({ rules }) // ?
  const input = { w: { a: { s: { d: 'BANANA' } } } }
  const expected = { i: { j: { k: { l: 'banana' } } } }

  const sandbox = createContext(context)
  const script = new Script(compiled!.code!, {})
  script.runInContext(sandbox, { timeout: 100 })
  const output = context.globalThis.plugin.default(input)
  expect(output).toEqual(expected)
})
