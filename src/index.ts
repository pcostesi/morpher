import getter from './getter'
import registry from './registry'
import setter from './setter'

export interface Rule {
  when: string
  transform?: string[]
  sink: string
  required?: boolean
}

export type Transformation = (data: any, options: string, rule: Rule) => any
export type AsyncTransformation = (input: any) => Promise<any>

export interface MorphOptions {
  rules: Rule[]
  registry?: {
    [_: string]: Transformation
  }
}

export const DEFAULT_OPTS: Partial<MorphOptions> = {
  registry,
}

export default class Morpher {
  constructor(private opts: MorphOptions) {
    this.opts = { ...DEFAULT_OPTS, ...opts }
    this.opts.registry = { ...registry, ...opts.registry }
  }

  private applyXforms(transformations: string[], rule: Rule, value: any) {
    const transform = (thing: any, transformation: string) => {
      const fns = this.opts.registry || registry
      const [name, options = ''] = transformation.split(':')
      const transformer = fns[name]
      if (!transformer || !(transformer instanceof Function)) {
        throw new Error(`Missing transformation <${transformation}>`)
      }
      if (thing === undefined) {
        return undefined
      }
      return transformer(thing, options, rule)
    }
    return transformations.reduce(transform, value)
  }

  private applyRule(rule: Rule, input: object, output: object) {
    const value = getter(input, rule.when)
    const transformations = rule.transform ?? []

    const transformed = this.applyXforms(transformations, rule, value)
    return setter(output, rule.sink, transformed)
  }

  apply(input: any, output?: any) {
    const handler = (obj: any, rule: Rule) => this.applyRule(rule, input, obj)

    return this.opts.rules.reduce(handler, output ?? {})
  }
}
