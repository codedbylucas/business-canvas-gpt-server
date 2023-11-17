export class AnswerAndAlternativeNotProvidedError extends Error {
  constructor () {
    super('Answer and alternative ID not provided')
    this.name = 'AnswerAndAlternativeNotProvidedError'
  }
}
