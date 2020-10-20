function get(subject: any, selector: string[]) {
  let index = 0
  let thing = subject
  while (thing && selector.length > index) {
    thing = thing[selector[index]]
    index += 1
  }
  return thing
}

export function compileGetter(selector: string): (subject: any) => any {
  const path = selector.split('.')
  return function compiled(subject: any): any {
    return get(subject, path)
  }
}

export default function getter(subject: any, selector: string): any {
  const path = selector.split('.')
  return get(subject, path)
}
