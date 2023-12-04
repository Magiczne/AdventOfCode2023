import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Card } from './card.ts'
import { counting } from 'radash'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const readCards = (file: string): ReadonlyArray<Card> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      const [rawId, data] = line.split(': ')
      const [rawWinningNumbers, rawSelectedNumbers] = data.split(' | ')

      const id = Number(rawId.replace('Card ', ''))
      const winningNumbers = rawWinningNumbers
        .trim()
        .split(/\s+/)
        .map(number => Number(number))
      const selectedNumbers = rawSelectedNumbers
        .trim()
        .split(/\s+/)
        .map(number => Number(number))

      return new Card(id, winningNumbers, selectedNumbers)
    })
}

const part1 = (file: string) => {
  return readCards(file)
    .map(card => card.points)
    .reduce((acc, points) => acc + points, 0)
}

const part2 = (file: string) => {
  const cards = readCards(file)
  const counter = counting(cards, card => card.id)

  cards.forEach(card => {
    card.winningCopiesIds.forEach(id => {
      counter[id] += counter[card.id]
    })
  })

  return Object.values(counter).reduce((acc, count) => acc + count, 0)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
