import getter from './getter'
import registry from './registry'
import setter from './setter'

export interface Rule {
  when: string
  transform?: string[]
  sink: string
  required?: boolean
}

export interface TransformationPayload extends Rule {
  options?: string
  data: any
}

export type Transformation = (opts: TransformationPayload) => any
export type AsyncTransformation = (input: any) => Promise<any>

export interface MorphOptions {
  rules: Rule[]
  registry?: {
    [_: string]: Transformation
  }
  getter?: (subject: any, selector: string) => any
  setter?: (subject: any, selector: string, value: any) => any
}

export const DEFAULT_OPTS: Partial<MorphOptions> = {
  registry,
  getter,
  setter,
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
      return transformer({ ...rule, options, data: thing })
    }
    return transformations.reduce(transform, value)
  }

  private applyRule(rule: Rule, input: object, output: object) {
    const getFn = this.opts?.getter || getter
    const setFn = this.opts?.setter || setter
    const value = getFn(input, rule.when)
    const transformations = rule.transform ?? []

    const transformed = this.applyXforms(transformations, rule, value)
    return setFn(output, rule.sink, transformed)
  }

  apply(input: any, output?: any) {
    const handler = (obj: any, rule: Rule) => this.applyRule(rule, input, obj)

    return this.opts.rules.reduce(handler, output ?? {})
  }
}
