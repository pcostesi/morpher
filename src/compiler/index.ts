import { transformAsync } from '@babel/core'
import { MorphOptions } from '../index'
import generate from '../generator'

export const DEFAULT_BABEL_OPTS = {
  plugins: [
    '@babel/plugin-transform-modules-umd',
    'closure-elimination',
    'tailcall-optimization',
  ],
  moduleId: 'plugin',
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: { node: 'current' },
        corejs: 3,
        ignoreBrowserslistConfig: true,
      },
    ],
  ],
}

export default async function compile(
  opts: MorphOptions,
  babelOpts = DEFAULT_BABEL_OPTS
) {
  const code = generate(opts)
  const generated = await transformAsync(code, babelOpts)
  return generated
}
