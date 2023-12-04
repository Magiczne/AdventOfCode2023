import { range } from 'ramda'
import { intersection } from '../util/index.ts'

class Card {
  private readonly matchedNumbers: ReadonlyArray<number>
  public readonly winningCopiesIds: ReadonlyArray<number>

  constructor(
    public readonly id: number,
    public readonly winningNumbers: ReadonlyArray<number>,
    public readonly selectedNumbers: ReadonlyArray<number>,
  ) {
    this.matchedNumbers = intersection(this.winningNumbers, this.selectedNumbers)
    this.winningCopiesIds = range(this.id + 1, this.id + 1 + this.matchedNumbers.length)
  }

  get points(): number {
    if (this.matchedNumbers.length === 0) {
      return 0
    }

    return Math.pow(2, this.matchedNumbers.length - 1)
  }
}

export { Card }
