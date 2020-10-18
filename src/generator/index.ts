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
    if (payload${index}.data === undefined) {
      break
    }
    payload${index}.options = ${JSON.stringify(options)}
    payload${index}.data = library[${JSON.stringify(name)}](payload${index})
    `
    })
    .join('\n')
}

function ruleToTransform(rule: Rule, index: number) {
  return `
  // Rule #${index}
  const rule${index} = ${JSON.stringify(rule)}
  let value${index} = ${compileGet(rule.when)} // get(input, ${JSON.stringify(
    rule.when
  )})
  let payload${index} = {...rule${index}, data: value${index}}
  while (value${index}) {
    ${transformsToFnCall(rule, index)}
    break
  }
  set(output, ${JSON.stringify(rule.sink)}, payload${index}.data)

  `
}

export default function compile(opts: MorphOptions) {
  const { rules } = opts

  return `
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
