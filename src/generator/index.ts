import { MorphOptions, Rule } from '../index'

function compileGet(selector: string, input = 'input') {
  const parts = selector.split('.')
  return `${input}?.${parts.join('?.')}`
}

function compileSetPath(selector: string, index: number) {
  const parts = selector.split('.')
  return `
  const setpath${index} = Object.freeze(${JSON.stringify(parts)})
  `
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
  set(setpath${index}, output, value${index})

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

function injectSetters(rules: Rule[]) {
  return `
  function set(selector, base, value) {
    let parent = base
    let idx = 0
    if (value === undefined) {
      return base
    }
    while (selector.length - 1 > idx) {
      const label = selector[idx]
      if (parent === undefined) {
        return base
      }
      if (!parent[label]) {
        parent[label] = {}
      }
      parent = parent[label]
      idx += 1
    }
    parent[selector[selector.length - 1]] = value
    return base
  }
  ${rules.map((rule, idx) => compileSetPath(rule.sink, idx)).join('\n')}
  `
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function preamble(opts: MorphOptions) {
  return `

    ${injectSetters(opts.rules)}
    ${injectRules(opts.rules)}
  `
}

export default function generate(opts: MorphOptions) {
  const { rules } = opts

  return `
  ${preamble(opts)}
  export default function matcher(input, output = {}) {
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
