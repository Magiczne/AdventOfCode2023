import { first, last } from 'radash'

class Sequence {
  constructor(public readonly data: ReadonlyArray<number>) {}

  extrapolateNextValue(): number {
    const sequences: Array<Sequence> = [this]

    do {
      sequences.push(last(sequences).generateDiffSequence())
    } while (!last(sequences).isEmpty())

    const extrapolatedSequences = sequences.reduceRight<Array<Sequence>>((acc, sequence, index, array) => {
      const newSequence =
        index === array.length - 1
          ? new Sequence([...sequence.data, 0])
          : new Sequence([...sequence.data, last(sequence.data) + last(first(acc).data)])

      return [newSequence, ...acc]
    }, [])

    return last(first(extrapolatedSequences).data)
  }

  extrapolatePreviousValue(): number {
    const sequences: Array<Sequence> = [this]

    do {
      sequences.push(last(sequences).generateDiffSequence())
    } while (!last(sequences).isEmpty())

    const extrapolatedSequences = sequences.reduceRight<Array<Sequence>>((acc, sequence, index, array) => {
      const newSequence =
        index === array.length - 1
          ? new Sequence([0, ...sequence.data])
          : new Sequence([first(sequence.data) - first(first(acc).data), ...sequence.data])

      return [newSequence, ...acc]
    }, [])
    return first(first(extrapolatedSequences).data)
  }

  generateDiffSequence(): Sequence {
    const data = this.data
      .reduce((acc, value, index, array) => {
        return [...acc, array[index + 1] - value]
      }, [])
      .filter(value => !isNaN(value))

    return new Sequence(data)
  }

  isEmpty(): boolean {
    return this.data.every(value => value === 0)
  }
}

export { Sequence }
