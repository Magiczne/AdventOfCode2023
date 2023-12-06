import { range } from 'radash'

class Race {
  constructor(
    public readonly time: number,
    public readonly recordDistance: number,
  ) {}

  get winOptions(): number {
    const distances: Array<number> = []

    /**
     * We could split this calculations in half, because this is symmetric
     * but brute-forcing 2nd part is like 3-4 seconds, so this is definitely not worth.
     */
    for (let i of range(0, this.time)) {
      const remainingTime = this.time - i
      const velocity = i

      distances.push(remainingTime * velocity)
    }

    return distances.filter(distance => distance > this.recordDistance).length
  }
}

export { Race }
