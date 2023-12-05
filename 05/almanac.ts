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
  private readonly sourceRangeEnd: number

  constructor(
    private readonly sourceRangeStart: number,
    private readonly destinationRangeStart: number,
    private readonly rangeLength: number,
  ) {
    this.sourceRangeEnd = sourceRangeStart + rangeLength
    this.difference = destinationRangeStart - sourceRangeStart
  }

  contains(source: number): boolean {
    return source >= this.sourceRangeStart && source <= this.sourceRangeEnd
  }

  convert(source: number): number {
    return source + this.difference
  }
}

class AlmanacMap {
  constructor(
    public readonly source: Category,
    public readonly target: Category,
    public readonly ranges: ReadonlyArray<AlmanacMapRange>,
  ) {}

  convert(source: number): number {
    for (const range of this.ranges) {
      if (range.contains(source)) {
        return range.convert(source)
      }
    }

    return source
  }
}

class Almanac {
  constructor(
    public readonly seeds: ReadonlyArray<number>,
    public readonly maps: ReadonlyArray<AlmanacMap>,
  ) {}

  /**
   * returns list of locations
   */
  processMapping(): Array<number> {
    return this.seeds.map(seed => {
      return this.maps.reduce((source, map) => {
        return map.convert(source)
      }, seed)
    })
  }
}

export { Almanac, AlmanacMap, AlmanacMapRange, Category }
