import { MorphOptions, Rule } from '../index'

function compileGet(selector: string, input = 'input') {
  const parts = selector.split('.')
  return `${input}?.${parts.join('?.')}`
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
  set(output, ${JSON.stringify(rule.sink)}, value${index})

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
  export default function matcher(input, output = {}, library = {}) {
    if (input === undefined) {
      return output
    }
    // Rules
    ${rules
      .map((rule: Rule, idx: number) => ruleToTransform(rule, idx))
      .join('\n\n')}
    return output
  }
  `
}
