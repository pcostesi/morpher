export default function lowercase(data: any) {
  if (typeof data === 'string') {
    return (data as string).toLowerCase()
  }
  throw new Error(`Expected a string, got ${typeof data}`)
}
