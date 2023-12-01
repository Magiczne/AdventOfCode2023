import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const part1 = (file: string) => {
  return readFileSync(resolve(__dirname, file), 'utf-8').trim()
}

const part2 = (file: string) => {
  return readFileSync(resolve(__dirname, file), 'utf-8').trim()
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
