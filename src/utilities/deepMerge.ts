/**
 * Deep merges two objects.
 * @param target The target object to merge into.
 * @param source The source object to merge from.
 * @returns The merged object.
 */
const deepMerge = (target: any, source: any): any => {
  const result = { ...target }

  Object.keys(source).forEach((key) => {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  })

  return result
}

export default deepMerge
