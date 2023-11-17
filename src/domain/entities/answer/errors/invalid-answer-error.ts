export class InvalidAnswerError extends Error {
  constructor (answer: string) {
    super(`The answer '${answer}' is invalid`)
    this.name = 'InvalidAnswerError'
  }
}
