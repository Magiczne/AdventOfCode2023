import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Hand } from './camel.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const part1 = (file: string) => {
  const hands = readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => Hand.fromString({ line }))

  hands.sort((lhs, rhs) => {
    const coefficient = lhs.figure - rhs.figure

    if (coefficient === 0) {
      for (let i = 0; i < 5; i++) {
        const cardCoefficient = lhs.cards[i] - rhs.cards[i]

        if (cardCoefficient !== 0) {
          return cardCoefficient
        }
      }
    }

    return coefficient
  })

  return hands.reduce((acc, hand, currentIndex) => {
    return acc + hand.bid * (currentIndex + 1)
  }, 0)
}

const part2 = (file: string) => {
  const hands = readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => Hand.fromString({ line, jokers: true }))

  hands.sort((lhs, rhs) => {
    const coefficient = lhs.figureWithJokers - rhs.figureWithJokers

    if (coefficient === 0) {
      for (let i = 0; i < 5; i++) {
        const cardCoefficient = lhs.cards[i] - rhs.cards[i]

        if (cardCoefficient !== 0) {
          return cardCoefficient
        }
      }
    }

    return coefficient
  })

  return hands.reduce((acc, hand, currentIndex) => {
    return acc + hand.bid * (currentIndex + 1)
  }, 0)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
