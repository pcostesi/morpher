import * as toBabel from 'estree-to-babel';
// see: https://stackoverflow.com/a/55060771
// https://nodejs.org/dist/latest-v5.x/docs/api/vm.html#vm_vm_runinnewcontext_code_sandbox_options

// import {generate} from 'escodegen'
import {parse} from 'acorn'
import {createContext, Script} from 'vm'

import {transformFromAstAsync, transform} from '@babel/core'
import getter from '../getter';
import setter from '../setter';


const code = `
export default function morpher(obj) {
  console.log('banana', obj)
  const rule1 = {
    source: 'a.b.c',
    sink: 'd.e.f',
    tranform: ['abc:def']
  }
  get(obj, rule1.source)
  return 'banana ' + JSON.stringify(obj)
}
`

test('babel does something async', () => {
  const theNewCode = transform(code)
  expect(theNewCode).toBeTruthy()
})

test('babel transforms ASTs', async () => {
  // const ast = await babelParse(code)
  const tokens = parse(code, {ecmaVersion: 'latest', sourceType: 'module'})

  const theNewCode = await transformFromAstAsync(toBabel(tokens))
  expect(theNewCode).toBeTruthy()
})

test('m returns string', async () => {

  const tokens = parse(code, {ecmaVersion: 'latest', sourceType: 'module'})
  const babelOpts = {"plugins": ["@babel/plugin-transform-modules-umd"], moduleId: 'plugin'}
  const generated = await transformFromAstAsync(toBabel(tokens), code, babelOpts) // ?

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const context = {globalThis: {
  } as any,
  get: getter,
  set: setter
}
  const sandbox = createContext(context)
  const script = new Script(generated!.code!, {})
  script.runInContext(sandbox, {timeout: 100}) // ?
  expect(/banana/.test(generated!.code!)).toBeTruthy()
  expect(context.globalThis.plugin.default({})).toBe('banana {}')
})
