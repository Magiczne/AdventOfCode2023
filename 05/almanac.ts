import { first, last, unique } from 'radash'
import { Range } from '../util/range.ts'

const enum Category {
  Seed = 'seed',
  Soil = 'soil',
  Fertilizer = 'fertilizer',
  Water = 'water',
  Light = 'light',
  Temperature = 'temperature',
  Humidity = 'humidity',
  Location = 'location',
}

class AlmanacMapRange {
  private readonly difference: number
  public readonly destinationRangeEnd: number
  public readonly sourceRangeEnd: number

  constructor(
    public readonly sourceRangeStart: number,
    public readonly destinationRangeStart: number,
    private readonly rangeLength: number,
  ) {
    this.sourceRangeEnd = sourceRangeStart + rangeLength
    this.destinationRangeEnd = destinationRangeStart + rangeLength
    this.difference = destinationRangeStart - sourceRangeStart
  }

  containsSource(source: number): boolean {
    return source >= this.sourceRangeStart && source <= this.sourceRangeEnd
  }

  containsDestination(destination: number): boolean {
    return destination >= this.destinationRangeStart && destination <= this.destinationRangeEnd
  }

  convertToDestination(source: number): number {
    return source + this.difference
  }

  convertToSource(destination: number): number {
    return this.sourceRangeStart + (destination - this.destinationRangeStart)
  }
}

class AlmanacMap {
  constructor(
    public readonly source: Category,
    public readonly target: Category,
    public readonly ranges: ReadonlyArray<AlmanacMapRange>,
  ) {}

  convertToDestination(source: number): number {
    for (const range of this.ranges) {
      if (range.containsSource(source)) {
        return range.convertToDestination(source)
      }
    }

    return source
  }

  convertToSource(destination: number): number {
    for (const range of this.ranges) {
      if (range.containsDestination(destination)) {
        return range.convertToSource(destination)
      }
    }

    return destination
  }

  /**
   * Operating on raw numbers instead of ranges, since we need to sort it.
   *
   * Basically, all the mapping are linear functions with continuity breaks, and
   * to find min/max we need to analyze the points where the continuity breaks.
   */
  invertRanges(initialBreakpoints: ReadonlyArray<number>): ReadonlyArray<number> {
    const allRangeBreakpoints = this.ranges
      .flatMap<[number, number]>(range => {
        return [
          [range.destinationRangeStart, range.sourceRangeStart],
          [range.destinationRangeEnd - 1, range.sourceRangeEnd - 1],
        ]
      })
      .sort((lhs, rhs) => lhs[0] - rhs[0])
      .map(value => value[1])

    const sourceValues = initialBreakpoints.map(y => this.convertToSource(y))
    sourceValues.sort()

    let inputBreakpoints = unique(allRangeBreakpoints)
    inputBreakpoints.sort()

    if (first(inputBreakpoints) > 0) {
      inputBreakpoints = [0, first(inputBreakpoints) - 1, ...inputBreakpoints]
    }

    if (last(inputBreakpoints) < Number.MAX_SAFE_INTEGER) {
      inputBreakpoints = [...inputBreakpoints, last(inputBreakpoints) + 1, Number.MAX_SAFE_INTEGER]
    }

    const calculatedBreakpoints = [...sourceValues, ...inputBreakpoints]
    calculatedBreakpoints.sort()

    return unique(calculatedBreakpoints)
  }
}

class Almanac<T extends number | Range> {
  constructor(
    public readonly seeds: ReadonlyArray<T>,
    public readonly maps: ReadonlyArray<AlmanacMap>,
  ) {}

  continuityBreakpoints(): ReadonlyArray<number> {
    // We're starting from 0 to whatever this is, because at the end
    // of the mappings we need to assume that every point of our function
    // is continuous.
    return this.maps.reduceRight((seeds, map) => map.invertRanges(seeds), [0, Number.MAX_SAFE_INTEGER])
  }

  /**
   * returns list of locations
   */
  processMapping(seeds: ReadonlyArray<number>): ReadonlyArray<number> {
    return seeds.map(seed => {
      return this.maps.reduce((source, map) => {
        return map.convertToDestination(source)
      }, seed)
    })
  }
}

export { Almanac, AlmanacMap, AlmanacMapRange, Category }
