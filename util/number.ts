const greatestCommonDenominator = (a: number, b: number): number => {
  return a % b === 0 ? b : greatestCommonDenominator(b, a % b)
}

const leastCommonMultiple = (numbers: ReadonlyArray<number>): number => {
  return numbers.reduce((lhs, rhs) => {
    return (lhs * rhs) / greatestCommonDenominator(lhs, rhs)
  })
}

export { greatestCommonDenominator, leastCommonMultiple }
