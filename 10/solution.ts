import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const enum Direction {
  Top = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

const enum MapElement {
  VPipe = '|',
  HPipe = '-',
  NEPipe = '└',
  NWPipe = '┘',
  SWPipe = '┐',
  SEPipe = '┌',
}

interface Point {
  x: number
  y: number
}

const readData = (file: string, replaceAnimalWith: string) => {
  const rawMap = readFileSync(resolve(__dirname, file), 'utf-8').trim().split('\n')

  const animalY = rawMap.findIndex(line => line.includes('S'))
  const animalX = rawMap[animalY].split('').findIndex(char => char === 'S')

  const map = rawMap.map(line => {
    return line
      .replaceAll('L', '└')
      .replaceAll('J', '┘')
      .replaceAll('7', '┐')
      .replaceAll('F', '┌')
      .replace('S', replaceAnimalWith)
      .split('')
  })

  return {
    startingAnimalPosition: {
      x: animalX,
      y: animalY,
    } as Point,
    map: map as ReadonlyArray<ReadonlyArray<MapElement>>,
  }
}

const part1 = (file: string, replaceAnimalWith: string) => {
  const { startingAnimalPosition, map } = readData(file, replaceAnimalWith)
  const animalPosition: Point = { ...startingAnimalPosition }

  const isLoopFulfilled = (): boolean => {
    return animalPosition.x === startingAnimalPosition.x && animalPosition.y === startingAnimalPosition.y
  }

  // Calculate loop length starting on position where the animal was
  let direction: Direction = 0
  let loopLength = 0

  while (true) {
    const element: MapElement = map[animalPosition.y][animalPosition.x]

    if (loopLength > 0 && isLoopFulfilled()) {
      break
    }

    loopLength++

    switch (element) {
      case MapElement.VPipe:
        animalPosition.y = direction === Direction.Down ? animalPosition.y - 1 : animalPosition.y + 1
        break

      case MapElement.HPipe:
        animalPosition.x = direction === Direction.Right ? animalPosition.x + 1 : animalPosition.x - 1
        break

      case MapElement.NEPipe:
        if (direction === Direction.Top) {
          animalPosition.x += 1
          direction = Direction.Right
        } else {
          animalPosition.y -= 1
          direction = Direction.Down
        }

        break

      case MapElement.NWPipe:
        if (direction === Direction.Top) {
          animalPosition.x -= 1
          direction = Direction.Left
        } else {
          animalPosition.y -= 1
          direction = Direction.Down
        }

        break

      case MapElement.SWPipe:
        if (direction === Direction.Down) {
          animalPosition.x -= 1
          direction = Direction.Left
        } else {
          animalPosition.y += 1
          direction = Direction.Top
        }

        break

      case MapElement.SEPipe:
        if (direction === Direction.Down) {
          animalPosition.x += 1
          direction = Direction.Right
        } else {
          animalPosition.y += 1
          direction = Direction.Top
        }

        break
    }
  }

  return loopLength / 2
}

const part2 = (file: string, replaceAnimalWith: string) => {
  const { map } = readData(file, replaceAnimalWith)

  return ''
}

// Carefully picked the replacement symbol for animal by hand :D
solutionExample(part1('example1.txt', '┌'))
solutionExample(part1('example2.txt', '┌'))
solutionPart1(part1('input.txt', '|'))

solutionExample(part2('example1.txt', '┌'))
solutionExample(part2('example2.txt', '┌'))
solutionPart1(part2('input.txt', '|'))
