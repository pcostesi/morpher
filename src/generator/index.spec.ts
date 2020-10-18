// see: https://stackoverflow.com/a/55060771
// https://nodejs.org/dist/latest-v5.x/docs/api/vm.html#vm_vm_runinnewcontext_code_sandbox_options

import { createContext, Script } from 'vm'

import { transform } from '@babel/core'
// import {writeFileSync} from 'fs';
import getter from '../getter'
import setter from '../setter'
import compile from '.'

const babelOpts = {
  plugins: ['@babel/plugin-transform-modules-umd'],
  moduleId: 'plugin',
  // presets: [["@babel/preset-env", {
  //   "targets": {
  //     "node": "current"
  //   }
  // }]],
}

const code = `
export default function morpher(input, output) {
  console.log('banana', input)

  const rule2 = {
    source: 'a.b.c',
    sink: 'd.e.f',
    tranform: ['abc:def', 'abc:ghi', 'abc:jkl']
  }
  const value2 = get(input, 'a.b.c')
  let payload2 = {...rule2, data: value2}
  payload2.options = 'def'
  payload2.data = library.abc(payload2)
  payload2.options = 'ghi'
  payload2.data = library.abc(payload2)
  payload2.options = 'jkl'
  payload2.data = library.abc(payload2)
  set(output, 'd.e.f', payload2.data)

  return output
}
`

test('compiles code', () => {
  const thing = compile({
    rules: [
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
    ],
  }) // ?
  const theNewCode = transform(thing, babelOpts) // ?
  expect(theNewCode).toBeTruthy()
})

test('babel does something async', () => {
  const theNewCode = transform(code)
  expect(theNewCode).toBeTruthy()
})

test('m returns string', async () => {
  const generated = transform(code, babelOpts)
  const input = {}
  const output = {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const context = {
    globalThis: {} as any,
    get: getter,
    set: setter,
    library: {
      abc: ({ data }: { [_: string]: any }) => data,
    },
  }
  const sandbox = createContext(context)
  const script = new Script(generated!.code!, {})
  script.runInContext(sandbox, { timeout: 100 })
  expect(/banana/.test(generated!.code!)).toBeTruthy()
  expect(context.globalThis.plugin.default(input, output)).toBe(output)
})
