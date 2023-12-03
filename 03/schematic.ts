import { range } from 'radash'
import { isNumeric } from '../util/index.ts'

interface Point {
  x: number
  y: number
}

class SchematicGear implements Point {
  public adjacentNumbers: Array<SchematicNumber> = []

  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  boundingBox(xMax: number, yMax: number): Array<Point> {
    return [
      // Top
      ...[...range(this.x - 1, this.x + 1)].map(x => {
        return { x, y: this.y - 1 }
      }),

      // Right
      { x: this.x + 1, y: this.y },

      // Bottom
      ...[...range(this.x - 1, this.x + 1)].map(x => {
        return { x, y: this.y + 1 }
      }),

      // Left
      { x: this.x - 1, y: this.y },
    ].filter(point => point.x >= 0 && point.x <= xMax && point.y >= 0 && point.y <= yMax)
  }

  get ratio(): number {
    return this.adjacentNumbers.reduce((acc, number) => acc * number.value, 1)
  }
}

class SchematicNumber {
  constructor(
    private readonly xStart: number,
    private readonly xEnd: number,
    private readonly y: number,
    public readonly value: number,
  ) {}

  boundingBox(xMax: number, yMax: number): Array<Point> {
    return [
      // Top
      ...[...range(this.xStart - 1, this.xEnd + 1)].map(x => {
        return { x, y: this.y - 1 }
      }),

      // Right
      { x: this.xEnd + 1, y: this.y },

      // Bottom
      ...[...range(this.xStart - 1, this.xEnd + 1)].map(x => {
        return { x, y: this.y + 1 }
      }),

      // Left
      { x: this.xStart - 1, y: this.y },
    ].filter(point => point.x >= 0 && point.x <= xMax && point.y >= 0 && point.y <= yMax)
  }

  overlaps(point: Point): boolean {
    return this.y === point.y && point.x >= this.xStart && point.x <= this.xEnd
  }
}

class Schematic {
  constructor(
    private readonly data: Array<Array<number | string>>,
    private readonly gears: Array<SchematicGear>,
    private readonly numbers: Array<SchematicNumber>,
  ) {}

  get validGears(): Array<SchematicGear> {
    return this.gears.filter(gear => {
      const adjacentNumbers = [
        ...new Set(
          gear
            .boundingBox(this.xMax, this.yMax)
            .map(point => {
              return this.numbers.find(number => number.overlaps(point))
            })
            .filter(value => value !== undefined),
        ),
      ] as Array<SchematicNumber>

      if (adjacentNumbers.length !== 2) {
        return false
      }

      gear.adjacentNumbers = adjacentNumbers

      return true
    })
  }

  get validPartNumbers(): Array<number> {
    return this.numbers
      .filter(number => {
        return number.boundingBox(this.xMax, this.yMax).some(point => {
          return this.data[point.y][point.x] !== '.' && !isNumeric(this.data[point.y][point.x])
        })
      })
      .map(number => number.value)
  }

  get xMax(): number {
    return this.data[0].length - 1
  }

  get yMax(): number {
    return this.data.length - 1
  }
}

export { Schematic, SchematicGear, SchematicNumber }
