import setter from '../setter'
import { MorphOptions, Rule } from '../index'

function compileGet(selector: string, input = 'input') {
  const parts = selector.split('.')
  return `${input}?.${parts.join('?.')}`
}

function setRules(rules: Rule[]) {
  const tree = {}
  rules.forEach((rule: Rule, index: number) => {
    setter(tree, rule.sink, index)
  })
  function treeToRepr(t: object | number): string {
    if (typeof t === 'number') {
      return `value${t}`
    }
    const things: string[] = Object.entries(t).map(
      ([key, value]) => `${key}: ${treeToRepr(value)}`
    )
    return `{
      ${things.join(', ')}
    }`
  }
  return treeToRepr(tree)
}

function transformsToFnCall(rule: Rule, index: number) {
  return (rule.transform || [])
    .map((transformation: string, tidx: number) => {
      const [name, options = ''] = transformation.split(':')
      return `
    // Step #${index}.${tidx}: apply ${name} from rule ${index}
    if (value${index} === undefined) {
      break
    }
    options${index} = ${JSON.stringify(options)}
    value${index} = library[${JSON.stringify(
        name
      )}](value${index}, options${index}, rule${index})
    `
    })
    .join('\n')
}

function ruleToTransform(rule: Rule, index: number) {
  return `
  // Rule #${index}
  let value${index} = ${compileGet(rule.when)}
  let options${index} = ''
  while (value${index}) {
    ${transformsToFnCall(rule, index)}
    break
  }

  `
}

function injectRules(rules: Rule[]) {
  return rules
    .map(
      (rule: Rule, index: number) =>
        `const rule${index} = Object.freeze(${JSON.stringify(rule)})`
    )
    .join('\n')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function preamble(opts: MorphOptions) {
  return `
    ${injectRules(opts.rules)}
  `
}

export default function generate(opts: MorphOptions) {
  const { rules } = opts

  return `
  ${preamble(opts)}
  export default function matcher(input) {
    // Rules
    ${rules
      .map((rule: Rule, idx: number) => ruleToTransform(rule, idx))
      .join('\n\n')}
    return ${setRules(rules)}
  }
  `
}
