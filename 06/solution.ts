import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { zip } from 'radash'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Race } from './race.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const readRaces = (file: string): ReadonlyArray<Race> => {
  const [rawTimes, rawDistances] = readFileSync(resolve(__dirname, file), 'utf-8').trim().split('\n')

  const times = rawTimes.split(':')[1].trim().split(/\s+/)
  const distances = rawDistances.split(':')[1].trim().split(/\s+/)

  return zip(times, distances).map(([time, distance]) => {
    return new Race(Number(time), Number(distance))
  })
}

const part1 = (file: string) => {
  const races = readRaces(file)

  return races.reduce((acc, race) => {
    return acc * race.winOptions
  }, 1)
}

const part2 = (file: string) => {
  const [time, distance] = readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      return line.split(':')[1].replaceAll(/\s+/g, '')
    })
    .map(line => Number(line))

  return new Race(time, distance).winOptions
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
