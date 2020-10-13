import { TransformationPayload } from 'index'

export default function lowercase({ data }: TransformationPayload) {
  if (typeof data === 'string') {
    return (data as string).toLowerCase()
  }
  throw new Error(`Expected a string, got ${typeof data}`)
}
