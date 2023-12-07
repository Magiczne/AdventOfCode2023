import { counting } from 'radash'
import { identity } from 'ramda'

const enum Figure {
  HighCard = 0,
  OnePair = 1,
  TwoPairs = 2,
  ThreeOfKind = 3,
  FullHouse = 4,
  FourOfKind = 5,
  FiveOfKind = 6,
}

class Hand {
  static cardValueMap: Record<string, number> = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  }

  static cardValueMapWithJokers: Record<string, number> = {
    A: 13,
    K: 12,
    Q: 11,
    T: 10,
    J: 1,
  }

  readonly figure: Figure
  readonly figureWithJokers: Figure

  private constructor(
    public readonly rawCards: string,
    public readonly cards: ReadonlyArray<number>,
    public readonly bid: number,
  ) {
    this.figure = this.getFigureWithoutJokers()
    this.figureWithJokers = this.getFigureWithJokers()
  }

  getFigureWithoutJokers(): Figure {
    /**
     * Excluding jokers when processing raw figure
     */
    const cardsToInclude = this.cards.filter(card => card !== 1)

    const counter = counting(cardsToInclude, identity)
    const counterValues = Object.values(counter)

    if (cardsToInclude.length === 5 && counterValues.length === 1) {
      return Figure.FiveOfKind
    }

    if (counterValues.some(value => value === 4)) {
      return Figure.FourOfKind
    }

    if (counterValues.includes(3) && counterValues.includes(2)) {
      return Figure.FullHouse
    }

    if (counterValues.includes(3)) {
      return Figure.ThreeOfKind
    }

    if (counterValues.filter(value => value === 2).length === 2) {
      return Figure.TwoPairs
    }

    if (counterValues.filter(value => value === 2).length === 1) {
      return Figure.OnePair
    }

    return Figure.HighCard
  }

  getFigureWithJokers(): Figure {
    const figure = this.getFigureWithoutJokers()
    const jokersCount = this.jokersCount

    switch (jokersCount) {
      case 5:
      case 4:
        return Figure.FiveOfKind

      case 3:
        if (figure === Figure.OnePair) return Figure.FiveOfKind
        return Figure.FourOfKind

      case 2:
        if (figure === Figure.HighCard) return Figure.ThreeOfKind
        if (figure === Figure.OnePair) return Figure.FourOfKind
        return Figure.FiveOfKind // ThreeOfKind

      case 1:
        if (figure === Figure.HighCard) return Figure.OnePair
        if (figure === Figure.OnePair) return Figure.ThreeOfKind
        if (figure === Figure.TwoPairs) return Figure.FullHouse
        if (figure === Figure.ThreeOfKind) return Figure.FourOfKind
        return Figure.FiveOfKind // FourOfKind

      case 0:
        return figure
    }
  }

  get jokersCount(): number {
    return this.cards.filter(card => card === 1).length
  }

  static fromString({ line, jokers = false }: { line: string; jokers?: boolean }): Hand {
    const [rawCards, bid] = line.split(' ')
    const map = jokers ? Hand.cardValueMapWithJokers : Hand.cardValueMap

    return new Hand(
      rawCards,
      rawCards.split('').map(card => map[card] ?? Number(card)),
      Number(bid),
    )
  }
}

export { Hand, Figure }
