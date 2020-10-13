import { TransformationPayload } from 'index'

export default function required(opts: TransformationPayload) {
  const thing = opts.data
  if (thing === undefined || thing === null) {
    throw new Error(`Missing required value for ${opts.when}`)
  }
  return thing
}
