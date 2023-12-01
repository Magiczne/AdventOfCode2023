import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { first, last } from 'radash'
import { isNumeric, solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const part1 = (file: string) => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(item => {
      const data = item.split('').filter(letter => isNumeric(letter))

      return Number(`${first(data)}${last(data)}`)
    })
    .reduce((acc, item) => acc + item, 0)
}

const part2 = (file: string) => {
  const letterNumbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      return [...line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g)]
        .map(match => match[1])
        .map(match => (isNumeric(match) ? Number(match) : letterNumbers.indexOf(match) + 1))
    })
    .map(data => Number(`${first(data)}${last(data)}`))
    .reduce((acc, item) => acc + item, 0)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example2.txt'))
solutionPart2(part2('input.txt'))
