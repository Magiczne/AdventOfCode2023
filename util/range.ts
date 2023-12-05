class Range {
  constructor(
    public readonly start: number,
    public readonly end: number,
  ) {}

  contains(point: number): boolean {
    return point >= this.start && point <= this.end
  }
}

export { Range }
