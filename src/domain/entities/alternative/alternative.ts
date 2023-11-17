export class Alternative {
  private static readonly descriptions: string[] = []

  private constructor (private readonly description: string) {
    Alternative.descriptions.push(description)
    Object.freeze(this)
  }

  static getDescription (alternative: Alternative): undefined | string {
    return Alternative.descriptions.find(
      description => description === alternative.description
    )
  }

  static create (description: string): Alternative {
    return new Alternative(description)
  }
}
