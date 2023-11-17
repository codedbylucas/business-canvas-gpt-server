export class MixedAnswerError extends Error {
  constructor () {
    super('A question should not be answered with \'alternativeId\' and \'answer\'')
    this.name = 'MixedAnswerError'
  }
}
