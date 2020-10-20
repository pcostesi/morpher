import { Rule } from 'index'

export default function required(thing: any, options: string, rule: Rule) {
  if (thing === undefined || thing === null) {
    throw new Error(`Missing required value for ${rule.when}`)
  }
  return thing
}
