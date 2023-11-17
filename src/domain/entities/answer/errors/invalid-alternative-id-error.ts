export class InvalidAlternativeIdError extends Error {
  constructor (alternativeId: string) {
    super(`The alternative with ID: '${alternativeId}' is invalid`)
    this.name = 'InvalidAlternativeIdError'
  }
}
