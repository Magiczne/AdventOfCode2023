import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { Schematic, SchematicGear, SchematicNumber } from './schematic.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const parseSchematic = (file: string): Schematic => {
  const data = readFileSync(resolve(__dirname, file), 'utf-8').trim().split('\n')

  const gears = data
    .map((line, index): Array<SchematicGear> => {
      return [...line.matchAll(/(\*)/g)].map((match): SchematicGear => {
        if (match.index === undefined) {
          throw new Error('WTF')
        }

        return new SchematicGear(match.index, index)
      })
    })
    .flat()

  const numbers = data
    .map((line, index): Array<SchematicNumber> => {
      return [...line.matchAll(/(\d+)/g)].map((match): SchematicNumber => {
        if (match.index === undefined) {
          throw new Error('WTF')
        }

        return new SchematicNumber(match.index, match.index + match[1].length - 1, index, Number(match[1]))
      })
    })
    .flat()

  return new Schematic(
    data.map(line => line.split('')),
    gears,
    numbers,
  )
}

const part1 = (file: string) => {
  return parseSchematic(file).validPartNumbers.reduce((acc, number) => acc + number, 0)
}

const part2 = (file: string) => {
  return parseSchematic(file).validGears.reduce((acc, gear) => {
    return acc + gear.ratio
  }, 0)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
