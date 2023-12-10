import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { solutionExample, solutionPart1, solutionPart2 } from '../util/index.ts'
import { writeFileSync } from 'fs'

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

type DataMap = ReadonlyArray<ReadonlyArray<MapElement>>

const readData = (file: string, replaceAnimalWith: MapElement) => {
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

const traversePipe = (startingAnimalPosition: Point, map: DataMap) => {
  const animalPosition: Point = { ...startingAnimalPosition }

  const isLoopFulfilled = (): boolean => {
    return animalPosition.x === startingAnimalPosition.x && animalPosition.y === startingAnimalPosition.y
  }

  // Calculate loop length starting on position where the animal was
  let direction: Direction = 0
  let loopLength = 0
  let traversedPointsSet = new Set<string>()

  while (true) {
    const element: MapElement = map[animalPosition.y][animalPosition.x]
    traversedPointsSet.add(`${animalPosition.y}-${animalPosition.x}`)

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

  return {
    loopLength,
    traversedPointsSet,
  }
}

const enhanceMap = (map: DataMap, traversedPointsSet: Set<string>) => {
  const enhanceSymbol = (symbol: MapElement): string => {
    switch (symbol) {
      case MapElement.VPipe:
        return '┃'
      case MapElement.HPipe:
        return '━'
      case MapElement.NEPipe:
        return '┗'
      case MapElement.NWPipe:
        return '┛'
      case MapElement.SWPipe:
        return '┓'
      case MapElement.SEPipe:
        return '┏'
    }
  }

  const newMap = structuredClone(map) as Array<Array<string>>

  // Enhancing borders
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      if (traversedPointsSet.has(`${y}-${x}`)) {
        newMap[y][x] = enhanceSymbol(map[y][x])
      }
    }
  }

  // Replace all not enhanced symbols with dots
  // Removing before and after first enhanced symbol
  for (let y = 0; y < newMap.length; y++) {
    newMap[y] = newMap[y]
      .join('')
      .replaceAll(MapElement.VPipe, '.')
      .replaceAll(MapElement.HPipe, '.')
      .replaceAll(MapElement.NEPipe, '.')
      .replaceAll(MapElement.NWPipe, '.')
      .replaceAll(MapElement.SWPipe, '.')
      .replaceAll(MapElement.SEPipe, '.')
      .split('')
  }

  return { enhancedMap: newMap }
}

const reverseEnhanceMap = (map: Array<Array<string>>) => {
  const reverseEnhancedMap: Array<Array<string>> = []

  for (let y = 1; y < map.length; y += 3) {
    const row: Array<string> = []

    for (let x = 1; x < map[0].length; x += 3) {
      row.push(map[y][x])
    }

    reverseEnhancedMap.push(row)
  }

  return { reverseEnhancedMap }
}

const generateFloodMap = (map: Array<Array<string>>): Array<Array<string>> => {
  // Each square will be now 3x3 square to perform correct flooding
  const floodMap: Array<Array<string>> = []

  for (let y = 0; y < map.length; y++) {
    const row1: Array<string> = []
    const row2: Array<string> = []
    const row3: Array<string> = []

    for (let x = 0; x < map[0].length; x++) {
      switch (map[y][x]) {
        case '┃':
          row1.push('.', '┃', '.')
          row2.push('.', '┃', '.')
          row3.push('.', '┃', '.')
          break

        case '━':
          row1.push('.', '.', '.')
          row2.push('━', '━', '━')
          row3.push('.', '.', '.')
          break

        case '┗':
          row1.push('.', '┃', '.')
          row2.push('.', '┗', '━')
          row3.push('.', '.', '.')
          break

        case '┛':
          row1.push('.', '┃', '.')
          row2.push('━', '┛', '.')
          row3.push('.', '.', '.')
          break

        case '┓':
          row1.push('.', '.', '.')
          row2.push('━', '┓', '.')
          row3.push('.', '┃', '.')
          break

        case '┏':
          row1.push('.', '.', '.')
          row2.push('.', '┏', '━')
          row3.push('.', '┃', '.')
          break

        default:
          row1.push('.', '.', '.')
          row2.push('.', '.', '.')
          row3.push('.', '.', '.')
      }
    }

    floodMap.push(row1, row2, row3)
  }

  return floodMap
}

const floodFill = (map: Array<Array<string>>) => {
  const queue: Array<Point> = [{ x: 0, y: 0 }]

  while (queue.length > 0) {
    const point = queue.shift()

    if (map[point.y][point.x] === '.') {
      map[point.y][point.x] = ' '

      if (point.y < map.length - 1 && map[point.y + 1][point.x] !== ' ') {
        queue.push({ x: point.x, y: point.y + 1 })
      }

      if (point.y - 1 > 0 && map[point.y - 1][point.x] !== ' ') {
        queue.push({ x: point.x, y: point.y - 1 })
      }

      if (point.x + 1 < map[0].length && map[point.y][point.x + 1] !== ' ') {
        queue.push({ x: point.x + 1, y: point.y })
      }

      if (point.x - 1 > 0 && map[point.y][point.x - 1] !== ' ') {
        queue.push({ x: point.x - 1, y: point.y })
      }
    }
  }
}

const part1 = (file: string, replaceAnimalWith: MapElement) => {
  const { startingAnimalPosition, map } = readData(file, replaceAnimalWith)
  const { loopLength } = traversePipe(startingAnimalPosition, map)

  return loopLength / 2
}

const part2 = (file: string, replaceAnimalWith: MapElement) => {
  const { startingAnimalPosition, map } = readData(file, replaceAnimalWith)
  const { traversedPointsSet } = traversePipe(startingAnimalPosition, map)
  const { enhancedMap } = enhanceMap(map, traversedPointsSet)

  const floodMap = generateFloodMap(enhancedMap)
  floodFill(floodMap)

  const { reverseEnhancedMap } = reverseEnhanceMap(floodMap)

  const mapString = reverseEnhancedMap.reduce((acc, line) => `${acc}${line.join('')}\n`, '')
  writeFileSync(resolve(__dirname, `out-${file}`), mapString, 'utf-8')

  return reverseEnhancedMap.reduce((acc, line) => {
    return (
      acc +
      line.reduce((lineAcc, item) => {
        return lineAcc + (item === '.' ? 1 : 0)
      }, 0)
    )
  }, 0)
}

// Carefully picked the replacement symbol for animal by hand :D
solutionExample(part1('example1.txt', MapElement.SEPipe))
solutionExample(part1('example2.txt', MapElement.SEPipe))
solutionPart1(part1('input.txt', MapElement.VPipe))

solutionPart2(part2('input.txt', MapElement.VPipe))
