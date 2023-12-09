import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Sequence } from './sequence.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const readSequences = (file: string): ReadonlyArray<Sequence> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      return line.split(' ').map(number => Number(number))
    })
    .map(data => new Sequence(data))
}

const part1 = (file: string) => {
  return readSequences(file)
    .map(sequence => sequence.extrapolateNextValue())
    .reduce((acc, value) => acc + value, 0)
}

const part2 = (file: string) => {
  return readSequences(file)
    .map(sequence => sequence.extrapolatePreviousValue())
    .reduce((acc, value) => acc + value, 0)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
