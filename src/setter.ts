function set(subject: any, selector: string[], value: any) {
  let thing = subject
  let prev
  let index = 0
  const last = selector[selector.length - 1]
  while (thing && selector.length > index) {
    const key = selector[index]
    index += 1
    prev = thing
    thing = thing[key] || {}
    prev[key] = thing
  }
  if (prev) {
    prev[last] = value
  }
  return subject
}

export default function setter(
  subject: any,
  selector: string,
  value: any
): any {
  const path = selector.split('.')
  return set(subject, path, value)
}
