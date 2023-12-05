import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Almanac, AlmanacMap, AlmanacMapRange, Category } from './almanac.ts'
import { range } from 'ramda'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const readAlmanac = ({ file, seedsAsRange }: { file: string; seedsAsRange: boolean }): Almanac => {
  const [rawSeedsLine, ...rawMaps] = readFileSync(resolve(__dirname, file), 'utf-8').trim().split('\n\n')

  const rawSeeds = rawSeedsLine.split(': ')[1]
  let seeds: Array<number>

  if (seedsAsRange) {
    const parsedSeeds = [...rawSeeds.matchAll(/(\d+) (\d+)/g)].flatMap(seedRange => {
      const start = Number(seedRange[1])
      const length = Number(seedRange[2])

      // Ramda, because exclusive
      return range(start, start + length)
    })

    seeds = [...new Set(parsedSeeds)]
  } else {
    seeds = rawSeeds.split(' ').map(seed => Number(seed))
  }

  const maps = rawMaps.map(rawMap => {
    const [rawCategories, rawRanges] = rawMap.split(' map:\n')

    const [source, target] = rawCategories.split('-to-')
    const ranges = rawRanges
      .split('\n')
      .map(rawRange => {
        return rawRange.split(' ').map(value => Number(value))
      })
      .map(rangeValues => {
        return new AlmanacMapRange(rangeValues[1], rangeValues[0], rangeValues[2])
      })

    return new AlmanacMap(source as Category, target as Category, ranges)
  })

  return new Almanac(seeds, maps)
}

const part1 = (file: string) => {
  const almanac = readAlmanac({ file, seedsAsRange: false })
  const locations = almanac.processMapping()

  return Math.min(...locations)
}

const part2 = (file: string) => {
  const almanac = readAlmanac({ file, seedsAsRange: true })

  return Math.min(...[0])
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

// solutionExample(part2('example.txt'))
// solutionPart2(part2('input.txt'))
