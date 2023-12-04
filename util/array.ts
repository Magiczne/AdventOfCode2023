const intersection = <T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>): ReadonlyArray<T> => {
  return array1.filter(value => {
    return array2.includes(value)
  })
}

const windows = <T>(array: Array<T>, windowLength: number): Array<Array<T>> => {
  return array
    .map((_, index) => {
      if (index <= array.length - windowLength) {
        return array.slice(index, index + windowLength)
      }

      return []
    })
    .filter(window => window.length > 0)
}

export { intersection, windows }
