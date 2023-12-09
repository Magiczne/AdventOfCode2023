const chunk = <T>(array: ReadonlyArray<T>, chunks: number): ReadonlyArray<T> => {
  return array.reduce(function (p, cur, i) {
    ;(p[(i / chunks) | 0] = p[(i / chunks) | 0] || []).push(cur)

    return p
  }, [])
}

function* cycle<T>(array: ReadonlyArray<T>): Generator<T, void, undefined> {
  while (true) {
    yield* array
  }
}

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

export { chunk, cycle, intersection, windows }
