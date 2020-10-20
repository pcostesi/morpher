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
    when: 'wasd',
    transform: ['slugify', 'lowercase'],
    sink: 'ijkl',
  },
]

test('compiles code', async () => {
  const code = compile({ rules }) // ?
  expect(code).toBeTruthy()
})

test('m returns string', async () => {
  const compiled = await compile({ rules })
  const input = {}
  const output = {}
  const context = {
    globalThis: {} as any,
    set: setter,
    library: {
      abc: ({ data }: { [_: string]: any }) => data,
    },
  }
  const sandbox = createContext(context)
  const script = new Script(compiled!.code!, {})
  script.runInContext(sandbox, { timeout: 100 })
  expect(context.globalThis.plugin.default(input, output)).toBe(output)
})
